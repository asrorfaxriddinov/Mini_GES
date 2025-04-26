import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const scale = (size: number) => (width / 800) * size;
const verticalScale = (size: number) => (height / 1280) * size;

export const planshetStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    flexDirection: "row", // Split screen horizontally
  },
  logo: {
    width: "50%", // Left half for image
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  GESlogo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Better image scaling
  },
  contentContainer: {
    width: "50%", // Right half for content
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
  },
  circleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  circle: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: "#ccc",
    marginHorizontal: scale(12),
  },
  keyboardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    maxWidth: scale(360),
    marginBottom: verticalScale(30),
  },
  button: {
    width: scale(70),
    height: scale(70),
    margin: scale(10),
    backgroundColor: "#d8f3dc",
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  iconButton: {
    width: scale(70),
    height: scale(70),
    margin: scale(10),
    backgroundColor: "#d8f3dc",
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: scale(26),
    color: "#333",
    fontWeight: "600",
  },
  iconImage: {
    width: scale(36),
    height: scale(36),
    tintColor: "#4361ee",
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
    width: "80%",
    maxWidth: scale(400),
    padding: scale(20),
    backgroundColor: "#fff",
    borderRadius: scale(15),
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    backgroundColor: "#f8f8f8",
    borderRadius: scale(8),
    paddingHorizontal: scale(15),
    fontSize: scale(16),
    color: "#333",
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  nextButton: {
    backgroundColor: "#4361ee",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(25),
    borderRadius: scale(8),
    alignItems: "center",
    width: "100%",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "bold",
  },
});

export const planshetImage = require("../../assets/GESlogo2.png");