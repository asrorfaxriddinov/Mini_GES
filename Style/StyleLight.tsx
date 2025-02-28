import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    modalText1:{
    fontFamily: 'monospace', fontSize: 24, color:'#fff', fontWeight: 'bold'
    },
    modalText2:{
     fontFamily: 'monospace', fontSize: 16, color:'#fff',fontWeight: 'bold' 
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    imagebutton1:{
      borderRadius: 5,
      padding:2,
      width:'100%',
      left:5
    },
    imagebutton: {
        width: 30,
        height: 30,
        borderRadius: 15, // width yoki height ning yarmi
        borderWidth: 2, // Chiziq qalinligi
        borderColor: '#000', // Chiziq rangi
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        bottom:'20%',
        left:'72%',
        backgroundColor:'#97EB05'
      },
    imageText:{
     color: '#fff',
     fontWeight: 'bold',
     fontSize: 22,
     
    },
    sliderContainer: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 300,
      backgroundColor: '#fff',
      zIndex: 1000,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute',
      right: 10,
      top: 10,
      backgroundColor: '#f00',
      borderRadius: 15,
      padding: 5,
      zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
      },
    modalContent: {
      width: '90%',
      backgroundColor: '#888',
      padding: 10,
      alignItems: 'center',
      borderRadius: 10,
    },
    fullImage: {
      width: '100%',
      height: 400,
      resizeMode: 'contain',
      borderRadius: 10,
    },
    cancelButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#30DB9E',
      borderRadius: 5,
      margin:20
    },
    cancelButton1: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#EA615C',
        borderRadius: 5,
        margin:20
      },
    cancelText: {
      color: '#000',
      fontSize: 16,
    },
    closeButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    sliderContent: {
    },
    sliderText: {
      fontSize: 18,
      color: '#000',
    },
    headerImage: {
      width: '100%',
      height: 400,
      borderRadius: 15,
      marginBottom: 20,
    },
    BarImage: {
      width: '100%',
      height: 320,
    },
    menuButton: {
      backgroundColor: '#000',
      top: '15%',
      left: '2%',
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
    },
    icons: {
      width: 35,
      height: 35,
    },
    searchBar: {
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 25,
      paddingHorizontal: 20,
      marginBottom: 20,
      backgroundColor: '#fff',
      alignSelf: 'center',
      width: '90%',
      textAlign: 'center',
    },
    stadiumContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 15,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: width / 2 - 20,
      marginBottom: 15,
    },
    image: {
      width: '100%',
      height: 120,
    },
    details: {
      padding: 10,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      textAlign: 'center',
    },
    info: {
      fontSize: 14,
      color: '#555',
      marginBottom: 3,
      textAlign: 'center',
    },
    button: {
      marginTop: 10,
      backgroundColor: '#30DB9E',
      borderRadius: 30,
 

      alignSelf: 'center',
      width:'70%',height:'70%'
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    circleContainer: {
      width: 100,
      height: 100,
      borderRadius: 75,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#000',
    },
    circleImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    placeholder: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f0f0f0',
    },
    imageButton: {
      marginTop: 0,
    },
    backgroundImage: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modal_buttons: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Shaffof qora fon
      height:40,
      marginVertical: 7,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      width: '95%',
      left:'2%'
    },
    shadow: {
      // iOS uchun soyalar
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
  
      // Android uchun soyalar
      elevation: 5,
    },
    modal_text: {
      marginLeft:'5%',
      paddingTop:'3%',
      paddingLeft:'8%',
      borderRadius: 10,
      width:'80%',
      height:'100%',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff', // Matn oq rangda bo‘lishi uchun
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Shaffof qora fon
    },
    modal_image:{
      width:40,
      height:40,
      left:'3%'
    },
    modal_buttons1: {
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Shaffof qora fon
      height:40,
      marginVertical: 7,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      width: '95%',
      left:'2%'
    },
    modal_image1:{
      left:'3%',
      alignItems:'center',
      color:'#fff'
    },
    modal_text1: {
      marginLeft:'7%',
      paddingTop:'2%',
      paddingLeft:'8%',
      borderRadius: 10,
      width:'75%',
      height:'100%',
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff', // Matn oq rangda bo‘lishi uchun
      backgroundColor: 'rgba(0, 0, 0, 0.2)', 
      flexDirection: 'row',
    },

  });
