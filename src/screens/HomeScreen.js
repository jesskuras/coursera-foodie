import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { BellIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import Categories from "../components/categories";
import axios from "axios";
import Recipes from "../components/recipes";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Beef");
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getCategories();
    getRecipes();
  }, []);

  const handleChangeCategory = (category) => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://www.themealdb.com/api/json/v1/1/categories.php"
      );
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const getRecipes = async (category = "Beef") => {
    try {
      const response = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      );
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length > 0) {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`
        );
        if (response && response.data) {
          setMeals(response.data.meals || []);
          setActiveCategory(""); // Clear active category when searching
        }
      } catch (err) {
        console.log("search error: ", err.message);
      }
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        style={{ paddingTop: hp(4) }}
      >
        {/* avatar and bell icon */}
        <View
          style={{
            marginHorizontal: wp(4),
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Image
            source={require("../../assets/icon.png")}
            style={{ height: hp(5), width: hp(5.5), borderRadius: 999 }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("Favorite")}
            style={{ marginRight: 10 }}
          >
            <BellIcon size={hp(4)} color="gray" />
          </TouchableOpacity>
        </View>

        {/* greetings and punchline */}
        <View style={{ marginHorizontal: wp(4), marginBottom: 10 }}>
          <Text style={{ fontSize: hp(1.7), color: "#606060" }}>Hello, User!</Text>
          <View>
            <Text
              style={{
                fontSize: hp(3.8),
                fontWeight: "600",
                color: "#333",
              }}
            >
              Make your own food,
            </Text>
          </View>
          <Text
            style={{ fontSize: hp(3.8), fontWeight: "600", color: "#333" }}
          >
            stay at <Text style={{ color: "#f59e0b" }}>home</Text>
          </Text>
        </View>

        {/* search bar */}
        <View
          style={{
            marginHorizontal: wp(4),
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 999,
            backgroundColor: "#f1f1f1",
            padding: 6,
          }}
        >
          <TextInput
            placeholder="Search for a recipe..."
            placeholderTextColor={"gray"}
            style={{ flex: 1, fontSize: hp(1.7), paddingLeft: 10 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 999,
                padding: 8,
              }}
            >
              <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
            </View>
          </TouchableOpacity>
        </View>

        {/* categories */}
        <View style={{ marginTop: 10 }}>
          {categories.length > 0 && (
            <Categories
              categories={categories}
              activeCategory={activeCategory}
              handleChangeCategory={handleChangeCategory}
            />
          )}
        </View>

        {/* recipes */}
        <View style={{ marginTop: 10 }}>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
    </View>
  );
}
