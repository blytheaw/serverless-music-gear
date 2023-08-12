export interface RentalData {
  id: string;
  name: string;
  description?: string;
  status: "available" | "rented";
  type: "drums" | "guitar" | "bass" | "keyboard" | "microphone";
}
