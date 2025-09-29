import React from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

export default function Recipes({ meals, categories }) {
  const navigation = useNavigation();

  const handlePress = async (item) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idMeal}`
      );
      const data = await response.json();
      if (data && data.meals) {
        const recipe = data.meals[0];
        navigation.navigate("RecipeDetail", { ...recipe, prepTime: "15-20", servings: "2", calories: "350", difficulty: "Easy" });
      }
    } catch (err) {
      console.log("error: ", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipes</Text>
      <View style={styles.listContainer}>
        {meals.length === 0 || categories.length === 0 ? null : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.idMeal}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <RecipeCard item={item} index={index} onPress={handlePress} />
            )}
            onEndReachedThreshold={0.1}
          />
        )}
      </View>
    </View>
  );
}

const RecipeCard = ({ item, index, onPress }) => {
  const isEven = index % 2 === 0;
  const animatedValue = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: animatedValue.value }],
    };
  });

  React.useEffect(() => {
    animatedValue.value = withSpring(1);
  }, []);

  const handlePressWithAnimation = () => {
    animatedValue.value = withSpring(0.9, {}, () => {
      animatedValue.value = withSpring(1, {}, () => {
        runOnJS(onPress)(item);
      });
    });
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        style={[styles.card, { paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }]}
        onPress={handlePressWithAnimation}
      >
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.image(isEven)}
        />
        <Text style={styles.name}>
          {item.strMeal.length > 20
            ? item.strMeal.slice(0, 20) + "..."
            : item.strMeal}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
  },
  title: {
    fontSize: hp(3),
    fontWeight: "600",
    color: "#333",
  },
  listContainer: {
    marginTop: hp(2),
  },
  card: {
    width: "100%",
    marginBottom: hp(2),
    justifyContent: "center",
  },
  image: (isEven) => ({
    width: "100%",
    height: isEven ? hp(25) : hp(35),
    borderRadius: 35,
    backgroundColor: "#00000020",
  }),
  name: {
    fontSize: hp(1.8),
    fontWeight: "600",
    color: "#333",
    marginTop: hp(1),
  },
});
