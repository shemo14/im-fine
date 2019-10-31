const ar = {	'skip':'تخطي',	'name': 'الاسم',	'phoneNumber': 'رقم الجوال',	'password': 'كلمة المرور',	'forgetPass': 'نسيت كلمة المرور ؟',	'visitor': 'دخول كزائر',	'login': 'دخول',	'registerButton': 'انشاء حساب',	'register': 'تسجيل',	'sendButton': 'ارسال',	'verifyCode': 'رقم التحقق',	'oldPass': 'كلمة المرور القديمة',	'newPass': 'كلمة المرور الجديدة',	'rePassword': 'تأكيد كلمة المرور',	'verifyNewPass': 'تأكيد كلمة المرور الجديدة',	'confirm': 'تأكيد',	'next': 'التالي',	'username': 'اسم المستخدم',	'fullName': 'الاسم بالكامل',	'email': 'الايميل',	'noNotifications': 'لا يوجد اشعارات',	'language': 'اللغة',	'stopNotification': 'غلق الاشعارات',	'shareApp': 'مشاركة التطبيق',	'home': 'الرئيسية',	'aboutApp': 'عن التطبيق',	'terms' : 'الشروط والاحكام',	'contactUs' : 'تواصل معنا',	'settings' : 'الاعدادات',	'logout' : 'تسجيل الخروج',	'notifications' : 'الاشعارات',	'notifs' : 'الاشعارات',	'notificationDeleted' : 'تم حذف الاشعار',	'search' : 'بحث',	'RS' : 'ر.س',	'city' : 'المدينة',	'date' : 'التاريخ',	'time' : 'الوقت',	'cancel' : 'الغاء',	'address' : 'العنوان',	'msg' : 'نص الرسالة',	'changePass' : 'تغيير كلمة المرور',	'chooseLang' : 'اختر لغة التطبيق',	'passwordRequired': 'كلمة السر مطلوبه',	'phoneRequired': 'رقم الهاتف مطلوب',	'passwordLength': 'كلمة السر اقل من 6 احرف',	'phoneValidation': 'رقم الهاتف غير صحيح',	'organizations': 'الهيئات',	'available':'متاح',	'notavailable':'غير متاح',	'verifyPassword': 'كلمة المرور و تأكيد كلمة المرور غير متطابقين',	'guest': 'زائر',	'codeNotCorrect' : 'كود التفعيل غير صحيح',	'emailNotCorrect': 'البريد الالكتروني غير صحيح',	'searchResult': 'نتائج البحث',	'noData' : 'لا يوجد بيانات',	'recoverPass' : 'يمكنك استرداد كلمة المرور',	'confirmNum' : 'سيتم ارسال رقم التأكيد علي جوالك في غضون ثواني',	'verifyText' : 'ادخل كود التحقق المرسل علي الهاتف',	'changePassText' : 'يمكنك تغيير كلمة المرور',	'location' : 'الموقع',	'verifyAcc' : 'يجب تأكيد حسابك',	'verifyAccText' : 'قم بادخال الكود المرسل علي الهاتف',	'searchPlaceholder': 'بحث عن قسم او منتج',	'searchProduct': 'بحث عن منتج',	'favorites': 'المفضلة',	'profile': 'الحساب الشخصي',	'editProfile': 'تعديل الحساب الشخصي',	'user': 'الحساب',	'myOrders': 'طلباتي',	'save': 'حفظ',	'offers': 'العروض',	'faq': 'اسئلة مكررة',	'languageSettings': 'اعدادات اللغة',	'agreeTo': 'الموافقة علي',	'finishOrder': 'انهاء الطلب',	'disCode': 'كود الخصم',	'region': 'المنطقة',	'packingMethod': 'طريقة التغليف',	'paymentMethod': 'طريقة الدفع',	'payment': 'الدفع',	'paymentDet': 'أدخل تفاصيل الدفع الخاصة بك',	'cardHolder': 'اسم حامل البطاقة',	'cardNumber': 'رقم البطاقة',	'ready': 'انت مستعد',	'completeOrder': 'اكمل الطلب',	'excellent': 'ممتاز',	'good': 'جيد',	'acceptable': 'مقبول',	'poor': 'ضعيف',	'cart': 'السلة',	'select': 'تحديد',	'selectAll': 'تحديد الكل',	'done': 'تم',	'sweetTypes': 'انواع الحلويات',	'todayDeal': 'صفقات اليوم',	'newlyAdded': 'المضافة حديثا',	'boxes': 'البوكسات',	'existingQuantity': 'الكمية الموجودة',	'addToCart': 'اضف الي السلة',	'boxContents': 'محتويات البوكس',	'itemSpecification': 'مواصفات السلعة',	'categories': 'الاقسام',	'implementedOrd': 'الطلبات المنفذه',	'newOrd': 'الطلبات الجديدة',	'NumberOfItems': 'عدد الاصناف',	'productPrice': 'سعر المنتج',	'packagingPrice': 'سعر التغليف',	'orderSpecification': 'مواصفات الطلب',	'fullOrderCost': 'تكلفة الطلبية كاملة',	'deliveryPrice': 'سعر التوصيل',	'specOfDele': 'مواصفات المندوب',	'call': 'اتصل',	'deliveryPlace': 'مكان التسليم',	'questionnaire': 'استبيان وتقييم للخدمة',	'sentNoti': 'سيتم ارسال اشعارات من اداره التطبيق او من الأدمن عند قبول الطلب',	'additionalOrders': 'طلبات اضافية',	'moreDetails': 'تفاصيل اكثر',	'howToPack': 'ادخل وصف بالتفصيل بالطريقة المراد التغليف بها',	'selectCity': 'اختر المدينة',	'selectRegion': 'اختر المنطقة',	'chooseMethod': 'اختر الطريقة المناسبة',	'basicInfo': 'معلومات أساسية',	'mada': 'مدي',	'visa': 'فيزا',	'uponReceipt': 'عند الاستلام',	'applePay': 'دفع أبل',	'completionOfOrder': 'اتمام الطلب',	'products': 'المنتجات',	'searchResults': 'نتائج البحث',	'deleteAcc': 'حذف الحساب',	'activationCode': 'كود التفعيل',	'total': 'المجموع الكلي',	'removeSelected': 'الغاء التحديد',	'startTime': 'وقت البداية',	'online': 'نشط',    'sick': 'مريض',    'lost': 'تائه',    'kidnapped': 'مخطوف',    'in_danger': 'في خطر',    'call_me': 'اتصل بي',    'message_me': 'راسلني',    'record_video': 'سجل فيديو',    'record_voice': 'سجل صوت',    'accident': 'حادث',    'whyNotFine': 'لماذا انت ليس بخير ؟',    'backHome': 'عوده للرئيسية',    'countryValidation': 'الرجاء اختيار كود الدولة',    'confirmSendStatus': 'تم ارسال حالتك لقائمة الطوارئ',};export default ar;