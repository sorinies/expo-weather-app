import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "fb3ffaa5ad636cf472bc1c74b88fd782"; // 임시

const icons = {
  Clouds: "cloudy",
  Rain: "rain",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  const [city, setCity] = useState("Loading...");
  const getWeather = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false); // 아직 거부됐을 때의 처리는 따로 하지 않음
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`);
    const json = await response.json();
    setDays(json.list);
  }
  useEffect(() => {
    getWeather();
  }, [])
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
      horizontal 
      pagingEnabled 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
        {days.length === 0 
        ? (
          <View style={styles.day}>
            <ActivityIndicator size="large" />
          </View>
          ) 
        : ( 
            days.map((day, index) => 
            <View key={index} style={styles.day}>
              <View style={styles.weatherDesc}>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Fontisto name={icons[day.weather[0].main]} size={56} color="black" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
            )
          )
        }
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2cc0f',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 48,
    fontWeight: "600",
  },
  weatherDesc: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  weather: {
    // flex: 3, contentContainerStyle는 사용할 수 없음
  },
  day: {
    // flex: 1, contentContainerStyle이 적용된 자식 또한 원하는 대로 적용되지 않음.
    width: SCREEN_WIDTH,
    padding: 16,
  },
  temp: {
    marginTop: 50,
    fontSize: 96,
    fontWeight: "800",
  },
  description: {
    fontSize: 36,
  },
  tinyText: {
    fontSize: 18,
  }
});
