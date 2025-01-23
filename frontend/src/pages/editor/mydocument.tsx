import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { UserMetaDataItem, SectionType } from "./types";
import { itemMapAtom } from "./state";
import { useAtomValue } from "jotai";

const styles = StyleSheet.create({
  page: {
    padding: "1in",
    fontFamily: "Times-Roman",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  name: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    fontFamily: "Times-Bold",
  },
  contacts: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 11,
    gap: 8,
  },
  divider: {
    margin: "0 4",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 3,
    marginBottom: 8,
    fontFamily: "Times-Bold",
  },
  field: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 2,
    fontFamily: "Times-Bold",
  },
  fieldContent: {
    fontSize: 11,
    color: "#000",
    lineHeight: 1.4,
  },
  pointData: {
    flexDirection: "row",
    paddingLeft: 12,
    marginBottom: 4,
  },
  bullet: {
    marginRight: 6,
    fontSize: 11,
  },
  pointContent: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.4,
  },
  sectionTime: {
    fontSize: 11,
    fontStyle: "italic",
  },
  sectionDes: {
    fontSize: 11,
    lineHeight: 1.4,
  },
});

const Mydocument = ({
  name,
  metadatas,
  sections,
}: {
  name: string;
  metadatas: UserMetaDataItem[];
  sections: SectionType[];
}) => {
  const itemMap = useAtomValue(itemMapAtom);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Contact */}
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.contacts}>
            {metadatas.map((field, index) => (
              <React.Fragment key={field.id}>
                <Text>{field.value}</Text>
                {index < metadatas.length - 1 && (
                  <Text style={styles.divider}>-</Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Sections */}
        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.displayName}</Text>
            {sections.map((section) => (
              <View key={section.id} style={styles.field}>
                {section.items.map((itemId) => {
                  const item = itemMap[itemId];
                  if (item.type === "POINT") {
                    return (
                      <View style={styles.pointData}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.pointContent}>{item.data}</Text>
                      </View>
                    );
                  } else {
                    return (
                      <View style={styles.field}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginBottom: 2,
                          }}
                        >
                          <Text style={styles.sectionTitle}>{item.title}</Text>
                          <Text style={styles.sectionTime}>
                            {item.timeRange}
                          </Text>
                        </View>
                        <Text style={styles.sectionDes}>
                          {item.description}
                        </Text>
                      </View>
                    );
                  }
                })}
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default Mydocument;
