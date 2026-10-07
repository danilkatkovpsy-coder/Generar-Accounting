import argparse
import hashlib
import json
import posixpath
import zipfile
from pathlib import Path
from xml.etree import ElementTree


NAMESPACES = {
    "xs": "http://www.w3.org/2001/XMLSchema",
    "link": "http://www.xbrl.org/2003/linkbase",
    "xlink": "http://www.w3.org/1999/xlink",
    "xbrli": "http://www.xbrl.org/2003/instance",
    "xml": "http://www.w3.org/XML/1998/namespace",
}


def attribute(name, namespace="xlink"):
    return f"{{{NAMESPACES[namespace]}}}{name}"


def read_taxonomy(archive_path):
    concepts = {}
    roles = {}
    presentations = {}
    schemas = []
    with zipfile.ZipFile(archive_path) as archive:
        names = archive.namelist()
        for name in names:
            if not name.endswith(".xsd"):
                continue
            root = ElementTree.fromstring(archive.read(name))
            namespace = root.get("targetNamespace", "")
            schemas.append({"file": name, "namespace": namespace})
            for element in root.findall("xs:element", NAMESPACES):
                identifier = element.get("id")
                if not identifier or not element.get("name"):
                    continue
                concepts[identifier] = {
                    "id": identifier,
                    "name": element.get("name"),
                    "namespace": namespace,
                    "schema": name,
                    "type": element.get("type", ""),
                    "abstract": element.get("abstract") == "true",
                    "periodType": element.get(attribute("periodType", "xbrli"), ""),
                    "balance": element.get(attribute("balance", "xbrli"), ""),
                    "labels": {},
                }
            for role in root.findall(".//link:roleType", NAMESPACES):
                roles[role.get("roleURI")] = {
                    "uri": role.get("roleURI"),
                    "definition": role.findtext("link:definition", "", NAMESPACES),
                    "schema": name,
                }

        for name in names:
            if not name.endswith(".xml"):
                continue
            root = ElementTree.fromstring(archive.read(name))
            for link in root.findall("link:labelLink", NAMESPACES):
                locations = {node.get(attribute("label")): node.get(attribute("href"), "").split("#")[-1]
                             for node in link.findall("link:loc", NAMESPACES)}
                labels = {node.get(attribute("label")): node for node in link.findall("link:label", NAMESPACES)}
                for arc in link.findall("link:labelArc", NAMESPACES):
                    concept = concepts.get(locations.get(arc.get(attribute("from"))))
                    label = labels.get(arc.get(attribute("to")))
                    if concept is None or label is None:
                        continue
                    language = label.get(attribute("lang", "xml"), "")
                    if label.get(attribute("role"), "").endswith("/label"):
                        concept["labels"][language] = "".join(label.itertext()).strip()
            for link in root.findall("link:presentationLink", NAMESPACES):
                role = link.get(attribute("role"))
                locations = {node.get(attribute("label")): node.get(attribute("href"), "").split("#")[-1]
                             for node in link.findall("link:loc", NAMESPACES)}
                arcs = []
                for arc in link.findall("link:presentationArc", NAMESPACES):
                    if arc.get("use") == "prohibited":
                        continue
                    parent = locations.get(arc.get(attribute("from")))
                    child = locations.get(arc.get(attribute("to")))
                    if parent in concepts and child in concepts:
                        arcs.append({"parent": parent, "child": child, "order": float(arc.get("order", "0")),
                                     "preferredLabel": arc.get("preferredLabel", "")})
                presentations.setdefault(role, []).extend(arcs)

    if not concepts or not presentations:
        raise ValueError("The archive has no supported concepts or presentation relationships")
    return {
        "source": "https://xbrl.eesti.ee/",
        "archiveUrl": "https://xbrl.eesti.ee/wp-content/uploads/2026/02/et-gaap_2026-01-01.zip",
        "version": "2026-01-01",
        "sha256": hashlib.sha256(Path(archive_path).read_bytes()).hexdigest(),
        "schemas": schemas,
        "concepts": concepts,
        "roles": [{**roles.get(uri, {"uri": uri, "definition": ""}), "relationships": relationships}
                  for uri, relationships in sorted(presentations.items())],
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("archive", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    taxonomy = read_taxonomy(arguments.archive)
    arguments.output.parent.mkdir(parents=True, exist_ok=True)
    arguments.output.write_text(json.dumps(taxonomy, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Imported {len(taxonomy['concepts'])} concepts and {len(taxonomy['roles'])} presentation roles")
    for role in taxonomy["roles"][:8]:
        print(role["uri"], role["definition"])


if __name__ == "__main__":
    main()