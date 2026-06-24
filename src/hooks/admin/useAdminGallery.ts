import { useMutation, useQueryClient } from "@tanstack/react-query";
import galleryService from "@/services/gallery/gallery.service";

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: galleryService.createGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}

export function useUpdateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { id: string; payload: any }) =>
      galleryService.updateGalleryItem(variables.id, variables.payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["galleryItem", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: galleryService.deleteGalleryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });
}
