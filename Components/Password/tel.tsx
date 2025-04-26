import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 667) * size;

export const telStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    width: "100%",
    height: verticalScale(250),
    alignItems: "center",
    justifyContent: "center",
  },
  GESlogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderBottomLeftRadius: scale(40),
    borderBottomRightRadius: scale(40),
  },
  circleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    width: "100%",
    position: "absolute",
    top: verticalScale(300),
  },
  circle: {
    width: scale(15),
    height: scale(15),
    borderRadius: scale(7.5),
    backgroundColor: "#ccc",
    marginHorizontal: scale(10),
  },
  keyboardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingBottom: verticalScale(20),
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around", // Har bir qatorda teng joylashish uchun
    width: "90%",
    maxWidth: scale(360), // 3 ta tugma uchun yetarli kenglik
  },
  button: {
    width: scale(100), // Tugma kengligini oshirdik
    height: scale(100),
    margin: scale(5),
    backgroundColor: "#d8f3dc",
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  iconButton: {
    width: scale(100),
    height: scale(100),
    margin: scale(5),
    backgroundColor: "#95d5b2",
    borderRadius: scale(10),
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  buttonText: {
    fontSize: scale(28), // Matnni biroz kattalashtirdik
    color: "#000",
    fontWeight: "bold",
  },
  iconImage: {
    width: scale(40),
    height: scale(40),
    tintColor: "#000",
  },
  signUpButton: {
    marginTop: verticalScale(20),
  },
  signUpText: {
    color: "#4361ee",
    fontSize: scale(18),
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: "90%",
    maxWidth: scale(400),
    padding: scale(20),
    backgroundColor: "#fff",
    borderRadius: scale(15),
    alignItems: "center",
    elevation: 5,
  },
  modalTitle: {
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#333",
    marginBottom: verticalScale(20),
  },
  emailInput: {
    width: "100%",
    height: verticalScale(50),
    backgroundColor: "#f0f0f0",
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    fontSize: scale(16),
    color: "#333",
    marginBottom: verticalScale(20),
  },
  nextButton: {
    backgroundColor: "#4361ee",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    borderRadius: scale(10),
  },
  nextButtonText: {
    color: "#fff",
    fontSize: scale(18),
    fontWeight: "bold",
  },
});

export const telImage = require("../../assets/GESlogo.webp");