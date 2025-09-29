import { View,Text,TextInput,TouchableOpacity,Image,StyleSheet, ScrollView} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [ingredients, setIngredients] = useState(recipeToEdit ? recipeToEdit.ingredients : "");
  const [instructions, setInstructions] = useState(recipeToEdit ? recipeToEdit.instructions : "");
  const [prepTime, setPrepTime] = useState(recipeToEdit ? recipeToEdit.prepTime : "");
  const [servings, setServings] = useState(recipeToEdit ? recipeToEdit.servings : "");
  const [calories, setCalories] = useState(recipeToEdit ? recipeToEdit.calories : "");
  const [difficulty, setDifficulty] = useState(recipeToEdit ? recipeToEdit.difficulty : "");

  const saverecipe = async () => {
    const newrecipe = {
      title,
      image,
      ingredients,
      instructions,
      prepTime,
      servings,
      calories,
      difficulty,
    };

    try {
      const existingrecipes = await AsyncStorage.getItem("recipes");
      let recipes = existingrecipes ? JSON.parse(existingrecipes) : [];

      if (recipeToEdit) {
        // If we are editing, replace the existing recipe with the new one
        recipes[recipeIndex] = newrecipe;
      } else {
        // Otherwise, add the new recipe to the list
        recipes.push(newrecipe);
      }

      await AsyncStorage.setItem("recipes", JSON.stringify(recipes));
      if (onrecipeEdited) {
        onrecipeEdited(newrecipe, recipeIndex);
      }
      navigation.navigate("MyFood");
    } catch (error) {
      console.error("Failed to save recipe:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChangeText={setIngredients}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(15), textAlignVertical: "top" }]}
      />
      <TextInput
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TextInput
        placeholder="Prep Time"
        value={prepTime}
        onChangeText={setPrepTime}
        style={styles.input}
      />
        <TextInput
        placeholder="Servings"
        value={servings}
        onChangeText={setServings}
        style={styles.input}
      />
        <TextInput
        placeholder="Calories"
        value={calories}
        onChangeText={setCalories}
        style={styles.input}
      />
        <TextInput
        placeholder="Difficulty"
        value={difficulty}
        onChangeText={setDifficulty}
        style={styles.input}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height:200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
