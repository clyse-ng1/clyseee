import JoinStatus from "../components/JoinStatus";
import iconCheck from "../assets/check-green-circle.svg";

export default function JoinConfirmed() {
  return (
    <JoinStatus
      title="Payment Confirmed"
      body="Your payment has been successfully processed"
      btnLabel="View Group"
      btnLabelM="Complete"
      btnVariant="dark"
      btnTo="/subscription-group"
      marqueeMt="mt-[60px]"
      hideBack
      iconD={<img src={iconCheck} alt="" className="h-[70px] w-[70px]" />}
      iconM={<img src={iconCheck} alt="" className="h-[54px] w-[54px]" />}
      iconTopD="mt-[251px]"
      titleMtD="mt-[80px]"
      iconTopM="pt-[123px]"
      titleMtM="mt-[73px]"
    />
  );
}
