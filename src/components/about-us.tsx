import Image from "next/image";

interface UserProfile {
    full_name: string | null;
}

interface AboutUsProps {
    profile: UserProfile | null;
}

export default function AboutUs({ profile }: AboutUsProps) {
    const isLoggedIn = !!profile;

    return (
        <section
            id="about-us"
            className="
                bg-white dark:bg-stone-950
                px-3
                sm:px-5
                lg:px-6
                py-7
                sm:py-10
                lg:py-24
                overflow-hidden
                text-right
            "
            dir="rtl"
        >
            <div className="max-w-7xl mx-auto">

                {/* ================= TITLE ================= */}
                <div className="mb-5 sm:mb-8 lg:mb-16">
                    <h2
                        className="
                            text-[21px]
                            sm:text-3xl
                            md:text-4xl
                            lg:text-6xl
                            font-black
                            text-stone-800
                            dark:text-white
                            leading-[1.7]
                            sm:leading-[1.55]
                            lg:leading-tight
                        "
                    >
                        {isLoggedIn ? (
                            <>
                                داستان ما؛
                                <br />
                                <span className="text-sage-600">
                                    با حضور تو، فصل جدیدی رقم خورد.
                                </span>
                            </>
                        ) : (
                            <>
                                داستان ما؛
                                <br />
                                <span className="text-sage-600">
                                    فراتر از یک آموزش ساده.
                                </span>
                            </>
                        )}
                    </h2>
                </div>

                {/* ================= MAIN GRID ================= */}
                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-12
                        gap-5
                        sm:gap-8
                        lg:gap-12
                        items-center
                    "
                >

                    {/* ================= IMAGE ================= */}
                    <div
                        className="
                            lg:col-span-7
                            relative
                            group
                            px-1
                            sm:px-2
                            lg:px-0
                        "
                    >

                        {/* Decorative layer */}
                        <div
                            className="
                                absolute
                                -inset-1.5
                                sm:-inset-3
                                lg:-inset-4
                                bg-sage-50/60
                                dark:bg-stone-900/60
                                rounded-[1.5rem]
                                sm:rounded-[2.5rem]
                                lg:rounded-[4rem]
                                -rotate-1
                                pointer-events-none
                            "
                        />

                        {/* Image container */}
                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-[1.25rem]
                                sm:rounded-[2rem]
                                lg:rounded-[3.5rem]
                                shadow-md
                                sm:shadow-lg
                                lg:shadow-2xl
                                border
                                border-stone-100
                                dark:border-stone-800
                                bg-white
                                dark:bg-stone-900
                            "
                        >
                            <Image
                                src="/tem-img.png"
                                alt="تیم ما"
                                width={1000}
                                height={700}
                                priority
                                className="
                                    w-full
                                    h-[135px]
                                    sm:h-[220px]
                                    md:h-[320px]
                                    lg:h-[550px]
                                    object-cover
                                    transition-transform
                                    duration-700
                                    group-hover:scale-[1.02]
                                "
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-sage-900/5
                                    opacity-0
                                    group-hover:opacity-100
                                    transition-opacity
                                    duration-500
                                    pointer-events-none
                                "
                            />
                        </div>
                    </div>

                    {/* ================= TEXT ================= */}
                    <div
                        className="
                            lg:col-span-5
                            space-y-4
                            sm:space-y-6
                            lg:space-y-8
                            lg:pr-4
                        "
                    >

                        {/* Intro */}
                        <div>
                            <h3
                                className="
                                    text-[16px]
                                    sm:text-xl
                                    lg:text-2xl
                                    font-bold
                                    text-stone-800
                                    dark:text-stone-100
                                    mb-2
                                    sm:mb-3
                                    lg:mb-4
                                "
                            >
                                {isLoggedIn
                                    ? `خوش برگشتی، ${
                                          profile?.full_name?.split(" ")[0] ??
                                          "دوست من"
                                      }`
                                    : "ما کی هستیم؟"}
                            </h3>

                            <p
                                className="
                                    text-[13px]
                                    sm:text-[15px]
                                    lg:text-lg
                                    text-stone-600
                                    dark:text-stone-400
                                    leading-6
                                    sm:leading-7
                                    lg:leading-loose
                                    font-medium
                                "
                            >
                                {isLoggedIn
                                    ? "تو حالا بخشی از جامعه‌ تین‌کد هستی. تمام تلاش ما این است که با ارائه محتوای عمیق و نقشه‌های راه دقیق، مسیر رشد و تحول شخصی تو را هموارتر کنیم. تداوم تو، سوخت موتور ماست."
                                    : "ما معتقدیم یادگیری نباید خسته‌کننده باشد. در اینجا، ما بستری فراهم کرده‌ایم که در آن دانش تخصصی با طراحی مدرن گره خورده تا تجربه‌ای متفاوت از رشد شخصی را رقم بزنیم."}
                            </p>
                        </div>

                        {/* Quote */}
                        <div
                            className="
                                border-r-2
                                sm:border-r-[3px]
                                border-sage-100
                                dark:border-sage-900
                                pr-3
                                sm:pr-5
                                py-0.5
                                sm:py-1
                            "
                        >
                            <p
                                className="
                                    text-[12px]
                                    sm:text-sm
                                    lg:text-base
                                    text-stone-500
                                    dark:text-stone-400
                                    italic
                                    font-medium
                                    leading-5
                                    sm:leading-7
                                "
                            >
                                {isLoggedIn
                                    ? "هر جلسه آموزشی که می‌بینی، یک کد جدید در ذهن تو برای تربیت بهتر فرزندت اجرا می‌شود. هوشمندانه ادامه بده."
                                    : "هدف ما فقط انتقال اطلاعات نیست، بلکه ایجاد تغییری پایدار در سبک زندگی و دیدگاه شماست."}
                            </p>
                        </div>

                        {/* ================= STATS ================= */}
                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-1
                                sm:gap-4
                                pt-0
                                sm:pt-2
                            "
                        >

                            {/* Stat 1 */}
                            <div className="text-center lg:text-right">
                                <span
                                    className="
                                        block
                                        text-xl
                                        sm:text-2xl
                                        lg:text-3xl
                                        font-black
                                        text-sage-600
                                    "
                                >
                                    ۲
                                </span>

                                <span
                                    className="
                                        text-[10px]
                                        sm:text-xs
                                        lg:text-sm
                                        text-stone-400
                                        font-bold
                                    "
                                >
                                    آزمون
                                </span>
                            </div>

                            {/* Stat 2 */}
                            <div className="text-center lg:text-right">
                                <span
                                    className="
                                        block
                                        text-xl
                                        sm:text-2xl
                                        lg:text-3xl
                                        font-black
                                        text-sage-600
                                    "
                                >
                                    +۱۲
                                </span>

                                <span
                                    className="
                                        text-[10px]
                                        sm:text-xs
                                        lg:text-sm
                                        text-stone-400
                                        font-bold
                                    "
                                >
                                    دوره تخصصی
                                </span>
                            </div>

                            {/* Stat 3 */}
                            <div className="text-center lg:text-right">
                                <span
                                    className="
                                        block
                                        text-xl
                                        sm:text-2xl
                                        lg:text-3xl
                                        font-black
                                        text-sage-600
                                    "
                                >
                                    ۲۴/۷
                                </span>

                                <span
                                    className="
                                        text-[10px]
                                        sm:text-xs
                                        lg:text-sm
                                        text-stone-400
                                        font-bold
                                    "
                                >
                                    پشتیبانی
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
