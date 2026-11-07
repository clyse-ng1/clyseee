import CreateResult from "./CreateResult";

/* /create/not-activated — Figma GROUP CREATION PAGE 9 (559:20989) with the
   corrected title: the disc, message and CTA are red because the group is
   not live. */
export default function CreateNotActivated() {
  return (
    <CreateResult
      ok={false}
      title="Group Not Activated"
      message="Your group is not live and visible to members"
    />
  );
}
