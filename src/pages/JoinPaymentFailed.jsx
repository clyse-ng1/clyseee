import JoinStatus from "../components/JoinStatus";
import iconError from "../assets/error-circle-red.svg";

export default function JoinPaymentFailed() {
  return (
    <JoinStatus
      title="Payment Failed"
      body={
        <>
          We couldn&apos;t process your payment.
          <br />
          Please try again
        </>
      }
      btnLabel="Try Again"
      btnLabelM="Complete"
      btnVariant="red"
      btnTo="/join/payment"
      marqueeMt="mt-[60px]"
      hideBack
      iconD={
        <span className="flex h-[130px] w-[130px] items-center justify-center rounded-[20px] bg-[#F0F4F1]">
          <img src={iconError} alt="" className="h-[100px] w-[100px]" />
        </span>
      }
      iconM={
        <span className="flex h-[100px] w-[100px] items-center justify-center rounded-[15px] bg-[#F0F4F1]">
          <img src={iconError} alt="" className="h-[77px] w-[77px]" />
        </span>
      }
      iconTopD="mt-[221px]"
      titleMtD="mt-[50px]"
      iconTopM="pt-[121px]"
      titleMtM="mt-[50px]"
    />
  );
}
