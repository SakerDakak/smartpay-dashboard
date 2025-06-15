export function validatePhoneNumber(phoneNumber: string, countryCode?: string): string | null {
    const digitsOnlyRegex = /^\d+$/;

    if (!phoneNumber) {
        return "رقم الجوال مطلوب.";
    }

    if (!digitsOnlyRegex.test(phoneNumber)) {
        return "رقم الجوال يجب أن يحتوي على أرقام فقط.";
    }

    if (countryCode === "966") {
        // Saudi Arabian numbers
        if (phoneNumber.startsWith("05") && phoneNumber.length === 10) {
            return null; // Valid: 05xxxxxxxx (10 digits)
        }
        if (phoneNumber.startsWith("5") && phoneNumber.length === 9) {
            return null; // Valid: 5xxxxxxxx (9 digits)
        }
        return "رقم سعودي غير صالح.";
    } else {
        // International numbers or no country code provided
        if (phoneNumber.startsWith("0") && phoneNumber.length === 10) {
            return null; // Valid: 0xxxxxxxxx (10 digits)
        }
        if (phoneNumber.length === 9) {
            // Valid: xxxxxxxxx (9 digits), no specific start digit required as per "بعدم اشتراك ان يكون يبداء برقم 5"
            return null; 
        }
        return "رقم الهاتف غير صالح.";
    }
}

export function validateName(name: string): string | null {
    if (!name) {
        return "الاسم مطلوب.";
    }
    
    if (name.trim().length < 3) {
        return "يجب أن يتكون الاسم من 3 أحرف على الأقل.";
    }
    
    // تعبير منتظم يقبل الأحرف العربية والإنجليزية والفراغات
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!nameRegex.test(name)) {
        return "يجب أن يحتوي الاسم على حروف فقط (بدون أرقام أو رموز خاصة).";
    }
    return null;
}

export function validateCity(city: string): string | null {
    if (!city) {
        return "اسم المدينة مطلوب.";
    }
    
    if (city.trim().length < 3) {
        return "يجب أن يتكون اسم المدينة من 3 أحرف على الأقل.";
    }
    
    // تعبير منتظم يقبل الأحرف العربية والإنجليزية والأرقام والفراغات
    const cityRegex = /^[\p{L}0-9\s]+$/u;
    if (!cityRegex.test(city)) {
        return "يجب أن يحتوي اسم المدينة على حروف أو أرقام فقط (بدون رموز خاصة).";
    }
    return null;
}

export function validateBrandName(brandName: string): string | null {
    if (!brandName) {
        return "اسم العلامة التجارية مطلوب.";
    }
    
    if (brandName.trim().length < 3) {
        return "يجب أن يتكون اسم العلامة التجارية من 3 أحرف على الأقل.";
    }
    
    // تعبير منتظم يقبل الأحرف العربية والإنجليزية والأرقام والفراغات
    const brandNameRegex = /^[\p{L}0-9\s]+$/u;
    if (!brandNameRegex.test(brandName)) {
        return "يجب أن يحتوي اسم العلامة التجارية على حروف أو أرقام فقط (بدون رموز خاصة).";
    }
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) {
        return "كلمة المرور مطلوبة.";
    }
    
    if (password.length < 8) {
        return "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.";
    }
    
    // Check for all same characters (e.g., "aaaa", "1111")
    const allSameCharsRegex = /^(.)\1+$/;
    if (allSameCharsRegex.test(password)) {
        return "كلمة المرور لا يمكن أن تتكون من حرف أو رقم مكرر فقط.";
    }
    
    // اختبار قوة كلمة المرور (اختياري)
    const hasLetter = /[\p{L}]/u.test(password); // يدعم الأحرف العربية والإنجليزية
    const hasDigit = /\d/.test(password);
    
    if (!(hasLetter && hasDigit)) {
        return "يجب أن تحتوي كلمة المرور على الأقل على حرف ورقم.";
    }
    
    return null;
}

/**
 * التحقق من صحة البريد الإلكتروني
 * @param email البريد الإلكتروني المراد التحقق منه
 * @returns رسالة الخطأ أو null إذا كان البريد صحيحاً
 */
export function validateEmail(email: string): string | null {
    if (!email) {
        return "البريد الإلكتروني مطلوب.";
    }
    
    // التحقق من عدم وجود فراغات
    if (email.includes(' ')) {
        return "البريد الإلكتروني لا يجب أن يحتوي على فراغات.";
    }
    
    // التحقق من صيغة البريد الإلكتروني بأحرف إنجليزية فقط
    // يسمح بالأحرف a-z, A-Z والأرقام 0-9 والرموز .-_+
    const emailRegex = /^[a-zA-Z0-9._\-+]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-.]+$/;
    if (!emailRegex.test(email)) {
        return "الرجاء إدخال بريد إلكتروني صالح باستخدام.";
    }
    
    // تحقق إضافي - نطاق البريد الإلكتروني
    const domainPart = email.split('@')[1];
    
    // التحقق من أن النطاق له امتداد صالح
    const validTLDs = /\.(com|net|org|edu|gov|mil|io|co|info|biz|me|sa|ae|eg|qa|kw|bh|om|jo|lb|ps|iq|sy|ma|dz|tn|ly|sd|ye)$/i;
    if (!validTLDs.test(domainPart)) {
        return "امتداد البريد الإلكتروني غير صالح.";
    }
    
    return null;
}

/**
 * التحقق من تطابق كلمتي المرور
 * @param password كلمة المرور الأصلية
 * @param confirmPassword تأكيد كلمة المرور
 * @param checkPasswordValidity التحقق من صحة كلمة المرور الأصلية أيضًا
 * @returns رسالة الخطأ أو null إذا كانت كلمات المرور متطابقة
 */
export function validatePasswordConfirmation(
    password: string,
    confirmPassword: string,
    checkPasswordValidity: boolean = false
): string | null {
    // التحقق من أن كلا الحقلين مملوءين
    if (!confirmPassword) {
        return "تأكيد كلمة المرور مطلوب.";
    }
    
    // التحقق من صحة كلمة المرور الأصلية إذا كان الخيار مفعلاً
    if (checkPasswordValidity) {
        const passwordError = validatePassword(password);
        if (passwordError) {
            return passwordError;
        }
    }
    
    // التحقق من تطابق كلمات المرور
    if (password !== confirmPassword) {
        return "كلمات المرور غير متطابقة.";
    }
    
    return null;
}
