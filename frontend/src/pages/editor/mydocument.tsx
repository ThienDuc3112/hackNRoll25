import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { UserMetaDataItem, SectionType } from "./types";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  name: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
  },
  contacts: {
    flexDirection: "row",
    justifyContent: "center",
    fontSize: 10,
    gap: 10,
  },
  divider: {
    margin: "0 5px",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
    backgroundColor: "#f5f5f5",
    padding: "5 10",
    borderRadius: 3,
  },
  field: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#444",
  },
  fieldContent: {
    fontSize: 10,
    color: "#666",
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
}) => (
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
                <Text style={styles.divider}>•</Text>
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Sections */}
      {sections.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.displayName}</Text>
          {sections.map((field) => (
            <View key={field.id} style={styles.field}>
              {/* <Text style={styles.fieldLabel}>{field.label}</Text>
              <Text style={styles.fieldContent}>{field.content}</Text> */}
            </View>
          ))}
        </View>
      ))}
    </Page>
  </Document>
);

export default Mydocument;
