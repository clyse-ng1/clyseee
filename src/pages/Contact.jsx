import { useState } from "react";
import Navbar from "../components/Navbar";
import { Footer, MobileFooter } from "../components/Footer";
import DesktopCta from "../components/DesktopCta";
import MobileCta from "../components/MobileCta";
import contactHero from "../assets/contact-hero.jpg";

/* Contact page — Figma 865:23267 (1440x2794, logged-out navbar).
   Copy fixes applied: "Send Us a  message" -> "Send Us a Message",
   message label "First Name" -> "Message", submit "Create Account" ->
   "Send Message", "24hours" -> "24 hours". No contact endpoint exists,
   so submit validates locally and shows a success note. */
const DESC =
  "Have a question about joining a group, managing your subscription, or using CLYSE? We\u2019re here to help. Reach out to our team, and we\u2019ll respond as soon as we can.";
const INFO_DESC =
  "Get in touch with our team for inquiries, project discussions, or business collaborations. We\u2019re here to provide the support, guidance and answers you need.";

function ShieldIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8 7.5 10 4.3-2 7.5-5.4 7.5-10v-6L12 2.5Z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 11.5 2.2 2.2L15.5 9.5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="#FFFFFF" strokeWidth="1.8" />
      <path
        d="M12 7.5V12l3.2 2"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3.2" stroke="#FFFFFF" strokeWidth="1.8" />
      <path
        d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="9.5" r="2.6" stroke="#FFFFFF" strokeWidth="1.8" />
      <path
        d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MailIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="#FFFFFF" strokeWidth="1.8" />
      <path
        d="m4.5 8 7.5 6 7.5-6"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6.8 4h3l1.5 4-2 1.5c.8 2 2.2 3.4 4.2 4.2l1.5-2 4 1.5v3c0 .8-.7 1.8-1.5 1.8C10.4 18 6 13.6 6 6.5c0-.8.3-2.5.8-2.5Z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TRUST = [
  { icon: <ShieldIcon />, text: "Your information is secure" },
  { icon: <ClockIcon />, text: "We typically respond within 24 hours" },
  { icon: <UsersIcon />, text: "Trusted by businesses worldwide" },
];

const inputCls =
  "h-[50px] w-full rounded-[10px] bg-white px-[15px] text-[20px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse";
const labelCls = "mb-[10px] block text-[18px] leading-[22px] font-semibold text-black";

function InfoRow({ icon, title, value }) {
  return (
    <div className="flex items-center gap-[30px]">
      <span className="grid h-[60px] w-[60px] flex-none place-items-center rounded-full bg-clyse">
        {icon}
      </span>
      <span>
        <span className="block text-[18px] leading-[22px] font-semibold text-[#0E0E0E]">
          {title}
        </span>
        <span className="mt-[10px] block text-[18px] leading-[22px] font-semibold text-[#0E0E0E]">
          {value}
        </span>
      </span>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSent(false);
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.first.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your first name, email and message.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setSent(true);
    setForm({ first: "", last: "", email: "", phone: "", company: "", service: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar />
      {/* Desktop hero — full-bleed dark band, content 1240x277 */}
      <section className="bg-deep relative hidden overflow-hidden xl:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 320px at 78% 10%, rgba(70,192,76,0.35), transparent 70%)",
          }}
        />
        <div className="relative mx-auto flex max-w-[1440px] gap-[70px] px-[20px] min-[1440px]:px-[100px] py-[100px]">
          <div className="w-[670px] flex-none">
            <span className="inline-flex items-center rounded-[10px] bg-clyse px-[24px] py-[13px] text-[18px] leading-[22px] font-bold text-white">
              CONTACT US
            </span>
            <h1 className="mt-[20px] text-[35px] leading-[43px] font-bold text-white">
              We&rsquo;re Here to Help
            </h1>
            <p className="mt-[30px] text-[18px] leading-[22px] font-semibold text-white">
              {DESC}
            </p>
            <div className="mt-[30px] flex items-center gap-[45px]">
              {TRUST.map((t) => (
                <div key={t.text} className="flex items-center gap-[15px]">
                  <span className="grid h-[36px] w-[36px] flex-none place-items-center rounded-full bg-clyse">
                    {t.icon}
                  </span>
                  <span className="max-w-[156px] text-[15px] leading-[18px] font-bold text-white">
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <img
            src={contactHero}
            alt="People using Clyse together"
            className="h-[277px] w-[500px] flex-none rounded-[40px] object-cover"
          />
        </div>
      </section>

      {/* Mobile hero */}
      <section className="bg-deep relative overflow-hidden xl:hidden">
        <div className="relative px-[30px] pt-[40px] pb-[40px]">
          <span className="inline-flex items-center rounded-[8px] bg-clyse px-[16px] py-[8px] text-[18px] leading-[22px] font-bold text-white">
            CONTACT US
          </span>
          <h1 className="mt-[16px] text-[20px] leading-[25px] font-bold text-white">
            We&rsquo;re Here to Help
          </h1>
          <p className="mt-[16px] text-[16px] leading-[24px] font-semibold text-white">
            {DESC}
          </p>
          <div className="mt-[24px] flex flex-col gap-[14px]">
            {TRUST.map((t) => (
              <div key={t.text} className="flex items-center gap-[12px]">
                <span className="grid h-[32px] w-[32px] flex-none place-items-center rounded-full bg-clyse">
                  {t.icon}
                </span>
                <span className="text-[14px] leading-[18px] font-bold text-white">
                  {t.text}
                </span>
              </div>
            ))}
          </div>
          <img
            src={contactHero}
            alt="People using Clyse together"
            className="mt-[30px] h-[200px] w-full rounded-[20px] object-cover"
          />
        </div>
      </section>

      {/* Desktop form + info */}
      <main className="mx-auto hidden max-w-[1440px] px-[20px] min-[1440px]:px-[100px] xl:block">
        <div className="mt-[122px] flex gap-[50px]">
          <div className="w-[703px] flex-none rounded-[20px] bg-mint p-[40px]">
            <h2 className="text-[20px] leading-[20px] font-bold text-black">
              Send Us a Message
            </h2>
            <p className="mt-[25px] text-[18px] leading-[22px] font-semibold text-black">
              Fill out the form below and we&rsquo;ll get back to you shortly
            </p>
            <form onSubmit={submit} className="mt-[40px]">
              <div className="grid grid-cols-2 gap-[20px]">
                <div>
                  <label className={labelCls} htmlFor="cf-first">
                    First Name
                  </label>
                  <input
                    id="cf-first"
                    className={inputCls}
                    placeholder="Enter your first name"
                    value={form.first}
                    onChange={set("first")}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="cf-last">
                    Last Name
                  </label>
                  <input
                    id="cf-last"
                    className={inputCls}
                    placeholder="Enter your last name"
                    value={form.last}
                    onChange={set("last")}
                  />
                </div>
              </div>
              <div className="mt-[40px] grid grid-cols-2 gap-[20px]">
                <div>
                  <label className={labelCls} htmlFor="cf-email">
                    Email
                  </label>
                  <input
                    id="cf-email"
                    type="email"
                    className={inputCls}
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
                <div>
                  <label className={labelCls} htmlFor="cf-phone">
                    Phone Number
                  </label>
                  <input
                    id="cf-phone"
                    type="tel"
                    className={inputCls}
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={set("phone")}
                  />
                </div>
              </div>
              <div className="mt-[40px]">
                <label
                  className="mb-[10px] block text-[16px] leading-[20px] font-semibold text-black"
                  htmlFor="cf-company"
                >
                  Company Name
                </label>
                <input
                  id="cf-company"
                  className={inputCls}
                  placeholder="Enter your company name"
                  value={form.company}
                  onChange={set("company")}
                />
              </div>
              <div className="mt-[40px]">
                <label className={labelCls} htmlFor="cf-service">
                  Service Interested In
                </label>
                <input
                  id="cf-service"
                  className={inputCls}
                  placeholder="Enter a service you are interested in"
                  value={form.service}
                  onChange={set("service")}
                />
              </div>
              <div className="mt-[40px]">
                <label className={labelCls} htmlFor="cf-message">
                  Message
                </label>
                <div className="relative">
                  <textarea
                    id="cf-message"
                    rows={5}
                    maxLength={1000}
                    className="h-[168px] w-full resize-none rounded-[10px] bg-white px-[15px] py-[15px] text-[20px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                    placeholder="Enter your message"
                    value={form.message}
                    onChange={set("message")}
                  />
                  <span className="pointer-events-none absolute right-[15px] bottom-[12px] text-[20px] font-medium text-[#999999]">
                    {form.message.length}/1000
                  </span>
                </div>
              </div>
              {error && (
                <p className="mt-[20px] text-center text-[16px] font-semibold text-[#E31B00]">
                  {error}
                </p>
              )}
              {sent && (
                <p className="mt-[20px] text-center text-[16px] font-semibold text-clyse">
                  Message sent &mdash; we&rsquo;ll get back to you shortly.
                </p>
              )}
              <button
                type="submit"
                className="bg-btn mt-[37px] flex h-[60px] w-full items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
              >
                Send Message
              </button>
              <p className="mt-[37px] text-center text-[16px] leading-[20px] font-semibold text-ink">
                We typically respond within 24 hours
              </p>
            </form>
          </div>
          <div className="h-fit w-[487px] flex-none rounded-[20px] bg-mint p-[40px]">
            <h2 className="text-[20px] leading-[20px] font-bold text-black">
              Contact Information
            </h2>
            <p className="mt-[20px] text-[18px] leading-[22px] font-semibold text-ink">
              {INFO_DESC}
            </p>
            <div className="mt-[50px] flex flex-col gap-[50px]">
              <InfoRow icon={<MailIcon />} title="Email" value="companyemail@email.com" />
              <InfoRow icon={<PhoneIcon />} title="Phone Number" value="+234 345 7689 365" />
            </div>
            <div className="mt-[50px] h-[5px] rounded-full bg-clyse" />
            <div className="mt-[43px] flex items-center gap-[30px]">
              <span className="grid h-[80px] w-[80px] flex-none place-items-center rounded-full bg-clyse">
                <ClockIcon size={40} />
              </span>
              <span>
                <span className="block text-[18px] leading-[22px] font-semibold text-black">
                  Business Hours
                </span>
                <span className="mt-[13px] block text-[18px] leading-[22px] font-semibold text-clyse">
                  Monday - Friday
                </span>
                <span className="mt-[5px] block text-[18px] leading-[22px] font-semibold text-clyse">
                  9:00AM - 7:00PM
                </span>
              </span>
            </div>
          </div>
        </div>
        <DesktopCta />
      </main>

      {/* Mobile form + info */}
      <main className="px-[30px] xl:hidden">
        <div className="mt-[40px] rounded-[20px] bg-mint p-[25px]">
          <h2 className="text-[18px] leading-[22px] font-bold text-black">
            Send Us a Message
          </h2>
          <p className="mt-[12px] text-[14px] leading-[20px] font-semibold text-black">
            Fill out the form below and we&rsquo;ll get back to you shortly
          </p>
          <form onSubmit={submit} className="mt-[24px] flex flex-col gap-[20px]">
            <div>
              <label
                className="mb-[8px] block text-[16px] font-semibold text-black"
                htmlFor="cm-first"
              >
                First Name
              </label>
              <input
                id="cm-first"
                className="h-[50px] w-full rounded-[10px] bg-white px-[15px] text-[16px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                placeholder="Enter your first name"
                value={form.first}
                onChange={set("first")}
              />
            </div>
            <div>
              <label
                className="mb-[8px] block text-[16px] font-semibold text-black"
                htmlFor="cm-last"
              >
                Last Name
              </label>
              <input
                id="cm-last"
                className="h-[50px] w-full rounded-[10px] bg-white px-[15px] text-[16px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                placeholder="Enter your last name"
                value={form.last}
                onChange={set("last")}
              />
            </div>
            <div>
              <label
                className="mb-[8px] block text-[16px] font-semibold text-black"
                htmlFor="cm-email"
              >
                Email
              </label>
              <input
                id="cm-email"
                type="email"
                className="h-[50px] w-full rounded-[10px] bg-white px-[15px] text-[16px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                placeholder="Enter your email address"
                value={form.email}
                onChange={set("email")}
              />
            </div>
            <div>
              <label
                className="mb-[8px] block text-[16px] font-semibold text-black"
                htmlFor="cm-phone"
              >
                Phone Number
              </label>
              <input
                id="cm-phone"
                type="tel"
                className="h-[50px] w-full rounded-[10px] bg-white px-[15px] text-[16px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={set("phone")}
              />
            </div>
            <div>
              <label
                className="mb-[8px] block text-[16px] font-semibold text-black"
                htmlFor="cm-company"
              >
                Company Name
              </label>
              <input
                id="cm-company"
                className="h-[50px] w-full rounded-[10px] bg-white px-[15px] text-[16px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                placeholder="Enter your company name"
                value={form.company}
                onChange={set("company")}
              />
            </div>
            <div>
              <label
                className="mb-[8px] block text-[16px] font-semibold text-black"
                htmlFor="cm-service"
              >
                Service Interested In
              </label>
              <input
                id="cm-service"
                className="h-[50px] w-full rounded-[10px] bg-white px-[15px] text-[16px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                placeholder="Enter a service you are interested in"
                value={form.service}
                onChange={set("service")}
              />
            </div>
            <div>
              <label
                className="mb-[8px] block text-[16px] font-semibold text-black"
                htmlFor="cm-message"
              >
                Message
              </label>
              <div className="relative">
                <textarea
                  id="cm-message"
                  rows={5}
                  maxLength={1000}
                  className="h-[168px] w-full resize-none rounded-[10px] bg-white px-[15px] py-[15px] text-[16px] font-medium text-ink outline-none placeholder:text-[#999999] focus:ring-2 focus:ring-clyse"
                  placeholder="Enter your message"
                  value={form.message}
                  onChange={set("message")}
                />
                <span className="pointer-events-none absolute right-[15px] bottom-[12px] text-[14px] font-medium text-[#999999]">
                  {form.message.length}/1000
                </span>
              </div>
            </div>
            {error && (
              <p className="text-center text-[14px] font-semibold text-[#E31B00]">
                {error}
              </p>
            )}
            {sent && (
              <p className="text-center text-[14px] font-semibold text-clyse">
                Message sent &mdash; we&rsquo;ll get back to you shortly.
              </p>
            )}
            <button
              type="submit"
              className="bg-btn flex h-[55px] w-full items-center justify-center rounded-[10px] text-[16px] font-semibold text-mint transition hover:opacity-90"
            >
              Send Message
            </button>
            <p className="text-center text-[14px] font-semibold text-ink">
              We typically respond within 24 hours
            </p>
          </form>
        </div>
        <div className="mt-[30px] rounded-[20px] bg-mint p-[25px]">
          <h2 className="text-[18px] leading-[22px] font-bold text-black">
            Contact Information
          </h2>
          <p className="mt-[12px] text-[14px] leading-[20px] font-semibold text-ink">
            {INFO_DESC}
          </p>
          <div className="mt-[24px] flex flex-col gap-[24px]">
            <div className="flex items-center gap-[16px]">
              <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-full bg-clyse">
                <MailIcon size={24} />
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-[#0E0E0E]">
                  Email
                </span>
                <span className="mt-[4px] block text-[14px] font-semibold text-[#0E0E0E]">
                  companyemail@email.com
                </span>
              </span>
            </div>
            <div className="flex items-center gap-[16px]">
              <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-full bg-clyse">
                <PhoneIcon size={24} />
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-[#0E0E0E]">
                  Phone Number
                </span>
                <span className="mt-[4px] block text-[14px] font-semibold text-[#0E0E0E]">
                  +234 345 7689 365
                </span>
              </span>
            </div>
          </div>
          <div className="mt-[24px] h-[4px] rounded-full bg-clyse" />
          <div className="mt-[24px] flex items-center gap-[16px]">
            <span className="grid h-[60px] w-[60px] flex-none place-items-center rounded-full bg-clyse">
              <ClockIcon size={30} />
            </span>
            <span>
              <span className="block text-[18px] font-semibold text-black">
                Business Hours
              </span>
              <span className="mt-[6px] block text-[18px] font-semibold text-clyse">
                Monday - Friday
              </span>
              <span className="mt-[2px] block text-[18px] font-semibold text-clyse">
                9:00AM - 7:00PM
              </span>
            </span>
          </div>
        </div>
        <MobileCta />
        <div className="pb-[60px]" />
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
