"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    User,
    Calendar,
    GraduationCap,
    Banknote,
    Users,
    Baby,
    ArrowLeft,
    Loader2,
    Mail,
    Lock,
    BriefcaseBusiness,
    Smartphone,
    Heart,
} from "lucide-react";
import { auth } from "@/lib/auth";
import api from "@/lib/axios";

interface Profile {
    full_name: string | null;
    mother_age: number | null;
    mother_education: string | null;
    father_education: string | null;
    mother_employment_status: string | null;
    family_income_status: string | null;
    number_of_children: number | null;
    number_of_teenagers: number | null;
    teenager_gender: string | null;
    teenager_age_range: string | null;
    has_attended_parenting_course: boolean | number | null;
    teenager_phone_internet_usage: string | null;
    teenager_living_with: string | null;
    email: string | null;
}

export default function CompleteProfile() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const [motherAge, setMotherAge] = useState("");
    const [motherEducation, setMotherEducation] = useState("");
    const [fatherEducation, setFatherEducation] = useState("");
    const [motherEmploymentStatus, setMotherEmploymentStatus] = useState("");
    const [familyIncomeStatus, setFamilyIncomeStatus] = useState("");

    const [numberOfChildren, setNumberOfChildren] = useState("");
    const [numberOfTeenagers, setNumberOfTeenagers] = useState("");

    const [teenagerGender, setTeenagerGender] = useState("");
    const [teenagerAgeRange, setTeenagerAgeRange] = useState("");
    const [hasAttendedParentingCourse, setHasAttendedParentingCourse] = useState("");
    const [teenagerPhoneInternetUsage, setTeenagerPhoneInternetUsage] = useState("");
    const [teenagerLivingWith, setTeenagerLivingWith] = useState("");

    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = auth.getToken();

            if (!token) {
                router.push("/login");
                return;
            }

            try {
                const userRes = await api.get("/user");
                const userData = userRes.data;

                setUserId(userData.user.id);

                const profileRes = await api.get(
                    `/profiles/${userData.user.id}`
                );

                const profile: Profile = profileRes.data;

                if (profile) {
                    setFullName(profile.full_name || "");
                    setEmail(profile.email || "");

                    setMotherAge(
                        profile.mother_age?.toString() || ""
                    );

                    setMotherEducation(
                        profile.mother_education || ""
                    );

                    setFatherEducation(
                        profile.father_education || ""
                    );

                    setMotherEmploymentStatus(
                        profile.mother_employment_status || ""
                    );

                    setFamilyIncomeStatus(
                        profile.family_income_status || ""
                    );

                    setNumberOfChildren(
                        profile.number_of_children?.toString() || ""
                    );

                    setNumberOfTeenagers(
                        profile.number_of_teenagers?.toString() || ""
                    );

                    setTeenagerGender(
                        profile.teenager_gender || ""
                    );

                    setTeenagerAgeRange(
                        profile.teenager_age_range || ""
                    );

                    setHasAttendedParentingCourse(
                        profile.has_attended_parenting_course
                            ? "yes"
                            : profile.has_attended_parenting_course === false
                                ? "no"
                                : ""
                    );

                    setTeenagerPhoneInternetUsage(
                        profile.teenager_phone_internet_usage || ""
                    );

                    setTeenagerLivingWith(
                        profile.teenager_living_with || ""
                    );
                }
            } catch (error) {
                console.error(error);
            } finally {
                setCheckingAuth(false);
            }
        };

        fetchProfile();
    }, [router]);

    // اگر تعداد فرزندان کم شد، تعداد نوجوانان را هم اصلاح می‌کنیم
    useEffect(() => {
        if (
            numberOfChildren &&
            numberOfTeenagers &&
            parseInt(numberOfTeenagers) > parseInt(numberOfChildren)
        ) {
            setNumberOfTeenagers(numberOfChildren);
        }
    }, [numberOfChildren, numberOfTeenagers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error("لطفاً نام و نام خانوادگی خود را وارد کنید");
            return;
        }

        if (password.length < 6) {
            toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
            return;
        }

        if (password !== passwordConfirm) {
            toast.error("رمز عبور با تکرار آن مطابقت ندارد");
            return;
        }

        if (!motherAge) {
            toast.error("لطفاً سن مادر را وارد کنید");
            return;
        }

        if (!motherEducation) {
            toast.error("لطفاً سطح تحصیلات مادر را انتخاب کنید");
            return;
        }

        if (!fatherEducation) {
            toast.error("لطفاً سطح تحصیلات پدر را انتخاب کنید");
            return;
        }

        if (!motherEmploymentStatus) {
            toast.error("لطفاً وضعیت اشتغال مادر را انتخاب کنید");
            return;
        }

        if (!familyIncomeStatus) {
            toast.error("لطفاً وضعیت درآمد خانواده را انتخاب کنید");
            return;
        }

        if (!numberOfChildren) {
            toast.error("لطفاً تعداد فرزندان را انتخاب کنید");
            return;
        }

        if (!numberOfTeenagers) {
            toast.error("لطفاً تعداد فرزندان نوجوان را انتخاب کنید");
            return;
        }

        if (parseInt(numberOfTeenagers) > parseInt(numberOfChildren)) {
            toast.error(
                "تعداد فرزندان نوجوان نمی‌تواند بیشتر از تعداد کل فرزندان باشد"
            );
            return;
        }

        if (!teenagerGender) {
            toast.error("لطفاً جنسیت فرزند نوجوان را انتخاب کنید");
            return;
        }

        if (!teenagerAgeRange) {
            toast.error("لطفاً محدوده سنی نوجوان را انتخاب کنید");
            return;
        }

        if (!hasAttendedParentingCourse) {
            toast.error(
                "لطفاً سابقه شرکت در دوره‌های تربیت نوجوان را مشخص کنید"
            );
            return;
        }

        if (!teenagerPhoneInternetUsage) {
            toast.error(
                "لطفاً میزان استفاده نوجوان از تلفن همراه و اینترنت را انتخاب کنید"
            );
            return;
        }

        if (!teenagerLivingWith) {
            toast.error(
                "لطفاً مشخص کنید نوجوان با چه کسی زندگی می‌کند"
            );
            return;
        }

        if (!userId) {
            toast.error("اطلاعات کاربر یافت نشد");
            return;
        }

        setLoading(true);

        try {
            await api.post("/complete-profile", {
                full_name: fullName,
                email: email,
                password: password,

                mother_age: motherAge
                    ? parseInt(motherAge)
                    : null,

                mother_education: motherEducation,
                father_education: fatherEducation,
                mother_employment_status: motherEmploymentStatus,
                family_income_status: familyIncomeStatus,

                number_of_children: numberOfChildren
                    ? parseInt(numberOfChildren)
                    : 0,

                number_of_teenagers: numberOfTeenagers
                    ? parseInt(numberOfTeenagers)
                    : 0,

                teenager_gender: teenagerGender,
                teenager_age_range: teenagerAgeRange,

                has_attended_parenting_course:
                    hasAttendedParentingCourse === "yes",

                teenager_phone_internet_usage:
                    teenagerPhoneInternetUsage,

                teenager_living_with:
                    teenagerLivingWith,
            });

            window.dispatchEvent(
                new Event("profile-updated")
            );

            const user = auth.getUser();

            if (user) {
                user.name = fullName;
                auth.setUser(user);
            }

            toast.success(
                "پروفایل شما با موفقیت تکمیل شد! ✨"
            );

            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (error: any) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                    "خطا در ذخیره اطلاعات"
            );
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
                <Loader2
                    className="animate-spin text-sage-600"
                    size={40}
                />
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950 p-6"
            dir="rtl"
        >
            <div className="w-full max-w-xl bg-white dark:bg-stone-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-stone-200/50 dark:border-stone-800/50">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100 italic">
                        نوجوانه
                    </h2>

                    <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-200 mt-2">
                        تکمیل اطلاعات پروفایل
                    </h2>

                    <p className="text-stone-500 text-sm mt-1">
                        لطفاً اطلاعات خود را کامل کنید
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* نام */}
                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                            <User size={20} />
                        </span>

                        <input
                            type="text"
                            required
                            placeholder="نام و نام خانوادگی"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm"
                        />
                    </div>

                    {/* ایمیل */}
                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                            <Mail size={20} />
                        </span>

                        <input
                            type="email"
                            placeholder="ایمیل (اختیاری)"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm"
                        />
                    </div>

                    {/* رمز */}
                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                            <Lock size={20} />
                        </span>

                        <input
                            type="password"
                            required
                            placeholder="رمز عبور (حداقل ۶ کاراکتر)"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm"
                        />
                    </div>

                    {/* تکرار رمز */}
                    <div className="relative md:col-span-2">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                            <Lock size={20} />
                        </span>

                        <input
                            type="password"
                            required
                            placeholder="تکرار رمز عبور"
                            value={passwordConfirm}
                            onChange={(e) =>
                                setPasswordConfirm(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm"
                        />
                    </div>

                    {/* سن مادر */}
                    <div className="relative">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                            <Calendar size={20} />
                        </span>

                        <input
                            type="number"
                            min="18"
                            max="100"
                            required
                            placeholder="سن مادر"
                            value={motherAge}
                            onChange={(e) =>
                                setMotherAge(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white text-sm"
                        />
                    </div>

                    {/* تحصیلات مادر */}
                    <div className="relative">
                        <select
                            required
                            value={motherEducation}
                            onChange={(e) =>
                                setMotherEducation(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                تحصیلات مادر
                            </option>
                            <option value="illiterate">
                                بی‌سواد
                            </option>
                            <option value="primary">
                                ابتدایی
                            </option>
                            <option value="diploma">
                                دیپلم
                            </option>
                            <option value="bachelor">
                                کارشناسی
                            </option>
                            <option value="bachelor_plus">
                                کارشناسی و بالاتر
                            </option>
                        </select>
                    </div>

                    {/* تحصیلات پدر */}
                    <div className="relative">
                        <select
                            required
                            value={fatherEducation}
                            onChange={(e) =>
                                setFatherEducation(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                تحصیلات پدر
                            </option>
                            <option value="illiterate">
                                بی‌سواد
                            </option>
                            <option value="primary">
                                ابتدایی
                            </option>
                            <option value="diploma">
                                دیپلم
                            </option>
                            <option value="bachelor">
                                کارشناسی
                            </option>
                            <option value="bachelor_plus">
                                کارشناسی و بالاتر
                            </option>
                        </select>
                    </div>

                    {/* اشتغال مادر */}
                    <div className="relative">
                        <select
                            required
                            value={motherEmploymentStatus}
                            onChange={(e) =>
                                setMotherEmploymentStatus(
                                    e.target.value
                                )
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                وضعیت اشتغال مادر
                            </option>
                            <option value="homemaker">
                                خانه‌دار
                            </option>
                            <option value="employed">
                                شاغل
                            </option>
                        </select>
                    </div>

                    {/* درآمد */}
                    <div className="relative">
                        <select
                            required
                            value={familyIncomeStatus}
                            onChange={(e) =>
                                setFamilyIncomeStatus(
                                    e.target.value
                                )
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                وضعیت درآمد خانواده
                            </option>
                            <option value="below_needs">
                                کمتر از حد کفاف
                            </option>
                            <option value="enough">
                                در حد کفاف
                            </option>
                            <option value="above_needs">
                                بیشتر از حد کفاف
                            </option>
                        </select>
                    </div>

                    {/* تعداد فرزندان */}
                    <div className="relative">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                            <Users size={20} />
                        </span>

                        <select
                            required
                            value={numberOfChildren}
                            onChange={(e) =>
                                setNumberOfChildren(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                تعداد فرزندان
                            </option>
                            <option value="1">
                                یک فرزند
                            </option>
                            <option value="2">
                                دو فرزند
                            </option>
                            <option value="3">
                                سه فرزند
                            </option>
                            <option value="4">
                                چهار فرزند و بیشتر
                            </option>
                        </select>
                    </div>

                    {/* تعداد نوجوان */}
                    <div className="relative">
                        <span className="absolute inset-y-0 right-4 flex items-center text-stone-400">
                            <Baby size={20} />
                        </span>

                        <select
                            required
                            value={numberOfTeenagers}
                            onChange={(e) =>
                                setNumberOfTeenagers(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                تعداد فرزندان نوجوان
                            </option>

                            {numberOfChildren &&
                                Array.from(
                                    {
                                        length: Math.min(
                                            parseInt(numberOfChildren),
                                            4
                                        ),
                                    },
                                    (_, index) => index + 1
                                ).map((count) => (
                                    <option
                                        key={count}
                                        value={count}
                                    >
                                        {count === 1
                                            ? "یک نوجوان"
                                            : count === 2
                                                ? "دو نوجوان"
                                                : count === 3
                                                    ? "سه نوجوان"
                                                    : "چهار نوجوان و بیشتر"}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* جنسیت نوجوان */}
                    <div className="relative">
                        <select
                            required
                            value={teenagerGender}
                            onChange={(e) =>
                                setTeenagerGender(e.target.value)
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                جنسیت فرزند نوجوان
                            </option>
                            <option value="girl">
                                دختر
                            </option>
                            <option value="boy">
                                پسر
                            </option>
                            <option value="both">
                                دختر و پسر
                            </option>
                        </select>
                    </div>

                    {/* سن نوجوان */}
                    <div className="relative">
                        <select
                            required
                            value={teenagerAgeRange}
                            onChange={(e) =>
                                setTeenagerAgeRange(
                                    e.target.value
                                )
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                محدوده سنی نوجوان
                            </option>
                            <option value="12-14">
                                ۱۲ تا ۱۴ سال
                            </option>
                            <option value="14-16">
                                ۱۴ تا ۱۶ سال
                            </option>
                            <option value="16-18">
                                ۱۶ تا ۱۸ سال
                            </option>
                        </select>
                    </div>

                    {/* سابقه دوره */}
                    <div className="relative">
                        <select
                            required
                            value={hasAttendedParentingCourse}
                            onChange={(e) =>
                                setHasAttendedParentingCourse(
                                    e.target.value
                                )
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                سابقه شرکت در دوره
                            </option>
                            <option value="yes">
                                بله، قبلاً شرکت کرده‌ام
                            </option>
                            <option value="no">
                                خیر، تاکنون شرکت نکرده‌ام
                            </option>
                        </select>
                    </div>

                    {/* استفاده از اینترنت */}
                    <div className="relative">
                        <select
                            required
                            value={teenagerPhoneInternetUsage}
                            onChange={(e) =>
                                setTeenagerPhoneInternetUsage(
                                    e.target.value
                                )
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                میزان استفاده از تلفن و اینترنت
                            </option>
                            <option value="low">
                                کم
                            </option>
                            <option value="medium">
                                متوسط
                            </option>
                            <option value="high">
                                زیاد
                            </option>
                        </select>
                    </div>

                    {/* محل زندگی */}
                    <div className="relative md:col-span-2">
                        <select
                            required
                            value={teenagerLivingWith}
                            onChange={(e) =>
                                setTeenagerLivingWith(
                                    e.target.value
                                )
                            }
                            className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl py-4 px-4 text-right outline-none focus:ring-2 focus:ring-sage-500 transition-all dark:text-white appearance-none text-sm"
                        >
                            <option value="">
                                نوجوان با چه کسی زندگی می‌کند؟
                            </option>
                            <option value="father">
                                با پدر
                            </option>
                            <option value="mother">
                                با مادر
                            </option>
                            <option value="both">
                                با هر دو والدین
                            </option>
                        </select>
                    </div>

                    {/* دکمه */}
                    <div className="md:col-span-2 pt-4">
                        <button
                            disabled={loading}
                            className="w-full bg-sage-600 hover:bg-sage-700 text-white py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2
                                    className="animate-spin"
                                    size={20}
                                />
                            ) : (
                                "ذخیره و ورود به داشبورد"
                            )}

                            {!loading && (
                                <ArrowLeft size={20} />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}