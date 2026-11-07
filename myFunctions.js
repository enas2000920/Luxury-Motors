// إظهار أو إخفاء تفاصيل السيارة
function toggleDetails(checkboxId, detailsId) {
    var checkBox = document.getElementById(checkboxId);
    var details = document.getElementById(detailsId);

    if (checkBox && details) {
        details.style.display = checkBox.checked ? "block" : "none";
    }
}

$(document).ready(function () {

    // معالجة نموذج الحجز
    $("#bookingForm").on("submit", function (e) {
        e.preventDefault();

        var fullName = $("#fullName").val().trim();
        var nationalId = $("#nationalId").val().trim();
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var mobile = $("#mobile").val().trim();
        var email = $("#email").val().trim();

        // التحقق من الحقول المطلوبة
        if (
            fullName === "" ||
            nationalId === "" ||
            startDate === "" ||
            endDate === "" ||
            mobile === ""
        ) {
            alert("يرجى ملء جميع الحقول المطلوبة.");
            return;
        }

        // التحقق من الاسم العربي
        if (!/^[\u0600-\u06FF ]+$/.test(fullName)) {
            alert("يرجى إدخال الاسم باللغة العربية فقط.");
            return;
        }

        // التحقق من الرقم الوطني
        if (!/^(0[1-9]|1[0-4])[0-9]{9}$/.test(nationalId)) {
            alert("الرقم الوطني يجب أن يتكون من 11 رقماً، وأول رقمين من 01 إلى 14.");
            return;
        }

        // التحقق من التواريخ
        var start = Date.parse(startDate + "T00:00:00Z");
        var end = Date.parse(endDate + "T00:00:00Z");

        if (isNaN(start) || isNaN(end) || end <= start) {
            alert("تاريخ نهاية التأجير يجب أن يكون بعد تاريخ البداية.");
            return;
        }

        var days = (end - start) / 86400000;

      if (!/^09(0|3|8|9|4|5|6)[0-9]{7}$/.test(mobile)) {
    alert("يرجى إدخال رقم موبايل سوري صحيح من Syriatel أو MTN.");
    return;
     }

        // التحقق من البريد الإلكتروني
        if (
            email !== "" &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            alert("يرجى إدخال بريد إلكتروني صحيح.");
            return;
        }

        // السيارات المختارة
        var selectedCars = $('input[name="selectCar"]:checked');

        if (selectedCars.length === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل.");
            return;
        }

        // أسعار السيارات اليومية
        var prices = {
            "CR-001": 250000,
            "CR-002": 400000,
            "CR-003": 300000,
            "CR-004": 180000,
            "CR-005": 200000
        };

        var total = 0;
        var result = "تم الحجز بنجاح!\n";
        result += "الاسم: " + fullName + "\n";
        result += "مدة التأجير: " + days + " أيام\n\n";

        // حساب تكلفة كل سيارة
        selectedCars.each(function () {

            var carCode = $(this).val();
            var price = prices[carCode];

            if (typeof price === "undefined") {
                return;
            }

            var carTotal = price * days;

            result += "السيارة: " + carCode + "\n";
            result += "السعر اليومي: " +
                price.toLocaleString("en-US") + " ل.س\n";
            result += "عدد الأيام: " + days + "\n";
            result += "تكلفة السيارة: " +
                carTotal.toLocaleString("en-US") + " ل.س\n\n";

            total += carTotal;
        });

        // حساب الخصم
        var discount = 0;

        if (days > 7) {
            discount = total * 0.10;
        }

        var finalTotal = total - discount;

        // عرض تفاصيل المبلغ
        result += "المجموع قبل الخصم: " +
            total.toLocaleString("en-US") + " ل.س\n";

        result += "قيمة الخصم: " +
            discount.toLocaleString("en-US") + " ل.س\n";

        result += "المبلغ النهائي: " +
            finalTotal.toLocaleString("en-US") + " ل.س";

        // عرض النتيجة داخل الصفحة
        $("#bookingResult").text(result);

        // عرض رسالة الحجز
        alert(result);
    });

});