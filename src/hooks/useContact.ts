import { useMutation } from "@tanstack/react-query";
import contactService from "@/services/contact/contact.service";
import { ContactSubmission } from "@/types";

export function useSubmitContact() {
  return useMutation({
    mutationFn: (payload: ContactSubmission) => contactService.submitContact(payload),
  });
}
export default useSubmitContact;
