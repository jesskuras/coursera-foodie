import React from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function FavoriteScreen() {
  const navigation = useNavigation();

  const favoriteRecipes = useSelector((state) => state.favorites);
  const favoriteRecipesList = favoriteRecipes?.favoriterecipes || [];

  return (
    <View style={{ flex: 1 }}>
      {/* Heading */}
      <View testID="FavoriteRecipes">
        <Text
          style={{ fontSize: hp(3.8), marginTop: hp(4), marginLeft: 20 }}
          className="font-semibold text-neutral-600"
        >
          My Favorite Recipes
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={{ color: "#fff" }}>Go back</Text>
      </TouchableOpacity>

      {favoriteRecipesList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite recipes yet!</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteRecipesList}
          keyExtractor={(item) => (item.idMeal || item.idC).toString()}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => navigation.navigate("RecipeDetail", { ...item })}
            >
              <Image
                source={{ uri: item.strMealThumb || item.image }}
                style={styles.recipeImage}
              />
              <View>
                <Text style={styles.recipeTitle}>
                  {(item.strMeal || item.name).length > 20
                    ? (item.strMeal || item.name).slice(0, 20) + "..."
                    : item.strMeal || item.name}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: hp(2.5),
    color: "#6B7280",
  },
  listContentContainer: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  cardContainer: {
    backgroundColor: "white",
    marginBottom: hp(2),
    padding: wp(4),
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  recipeImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 10,
    marginRight: wp(4),
  },
  recipeTitle: {
    fontSize: hp(2),
    fontWeight: "bold",
    color: "#4B5563",
  },
  backButton: {
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 100,
    alignItems: "center",
    marginLeft: 20,
    marginBottom: 10,
  },
});
