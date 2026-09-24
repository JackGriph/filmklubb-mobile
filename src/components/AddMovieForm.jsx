import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../constants/colors";

const TYPES = ["Film", "Serie"];

export default function AddMovieForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Film");
  const [notes, setNotes] = useState("");

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Titel"
        placeholderTextColor={colors.muted}
        value={title}
        onChangeText={setTitle}
        maxLength={200}
        autoFocus
      />

      <View style={styles.types}>
        {TYPES.map((t) => (
          <Pressable
            key={t}
            style={[styles.type, type === t && styles.typeOn]}
            onPress={() => setType(t)}
            accessibilityRole="button"
            accessibilityState={{ selected: type === t }}
          >
            <Text style={styles.typeText}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={[styles.input, styles.notes]}
        placeholder="Anteckning (valfritt)"
        placeholderTextColor={colors.muted}
        value={notes}
        onChangeText={setNotes}
        maxLength={1000}
        multiline
      />

      <Pressable style={styles.submit} onPress={() => onAdd({ title, type, notes })}>
        <Text style={styles.submitText}>Lägg till</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 15,
  },
  notes: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  types: {
    flexDirection: "row",
    gap: 8,
  },
  type: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: 999,
  },
  typeOn: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  typeText: {
    color: colors.text,
    fontSize: 14,
  },
  submit: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  submitText: {
    color: colors.text,
    fontWeight: "600",
  },
});
