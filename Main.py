import time
import mss
import pytesseract
import cv2
import numpy as np
from deep_translator import GoogleTranslator
import pyautogui

# Tesseract yo‘li (Windowsda kerak bo‘lsa)
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Tarjimon obyekti
translator = GoogleTranslator(source='auto', target='uz')  # O'zbek tiliga tarjima qilish

def get_screenshot():
    """ Ekrandan screenshot oladi """
    with mss.mss() as sct:
        screenshot = sct.grab(sct.monitors[1])  # Butun ekran
        img = np.array(screenshot)
        return img

def detect_and_translate(img):
    """ OCR yordamida matnni aniqlash va tarjima qilish """
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Rasmni qora-oq qilish
    text_data = pytesseract.image_to_data(gray, lang="eng", output_type=pytesseract.Output.DICT)  

    for i in range(len(text_data["text"])):
        word = text_data["text"][i].strip()
        if word:  
            x, y, w, h = (text_data["left"][i], text_data["top"][i], text_data["width"][i], text_data["height"][i])
            translated_word = translator.translate(word)  

            # Ekranda tarjima qilingan matnni o‘rniga qo‘yish
            cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), -1)  # Yashil fon
            cv2.putText(img, translated_word, (x, y + h), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 0), 2)  

    return img

def main():
    """ Dastur doimiy ravishda ishlaydi va tarjima qiladi """
    while True:
        img = get_screenshot()
        translated_img = detect_and_translate(img)

        # Natijani ekranda chiqarish
        cv2.imshow("Real-time Translation", translated_img)

        # Dasturni to‘xtatish uchun 'q' tugmasini bosing
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
