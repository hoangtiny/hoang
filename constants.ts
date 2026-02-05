
import { Mood, Ingredient, RealMenuItem } from './types';

export const MOODS = [
  { id: Mood.HAPPY, icon: "😊", label: Mood.HAPPY },
  { id: Mood.STRESSED, icon: "😫", label: Mood.STRESSED },
  { id: Mood.CHILL, icon: "🍃", label: Mood.CHILL },
  { id: Mood.HEARTBROKEN, icon: "💔", label: Mood.HEARTBROKEN },
  { id: Mood.EXCITED, icon: "🤩", label: Mood.EXCITED },
  { id: Mood.TIRED, icon: "😴", label: Mood.TIRED },
];

export const INGREDIENTS = [
  { id: Ingredient.SASHIMI, icon: "🍱", label: Ingredient.SASHIMI },
  { id: Ingredient.SUSHI, icon: "🍣", label: Ingredient.SUSHI },
  { id: Ingredient.HOTPOT, icon: "🍲", label: Ingredient.HOTPOT },
  { id: Ingredient.GRILL, icon: "🥩", label: Ingredient.GRILL },
];

export const REAL_MENU: RealMenuItem[] = [
  { id: "H01", name: "Sashimi Cá Ngừ Đại Dương", description: "Từng lát cá tươi rói, ngọt lịm từ biển sâu." },
  { id: "H02", name: "Sushi Thuyền Rồng Đặc Biệt", description: "Tổng hợp các loại sushi cao cấp được trình bày nghệ thuật." },
  { id: "H03", name: "Lẩu Wagyu Thượng Hạng", description: "Nước dùng thanh tao cùng thịt bò Wagyu tan chảy." },
  { id: "H04", name: "Bò Nướng Đá Núi Lửa", description: "Thịt bò nướng xèo xèo giữ trọn hương vị nguyên bản." },
  { id: "H05", name: "Sashimi Bào Ngư Nhật", description: "Món ăn hoàng gia giòn sần sật, giàu dinh dưỡng." },
  { id: "H06", name: "Set Sashimi Mùa Xuân", description: "Những hương vị tinh túy nhất của mùa xuân Nhật Bản." }
];

export const LOADING_MESSAGES = [
  "Bếp trưởng Miresto đang mài dao...",
  "Đang chọn lọc những lát cá tươi nhất...",
  "Nghệ thuật trình bày đang được thực hiện...",
  "Gần xong rồi, một chút tinh hoa cuối cùng...",
  "Tuyệt tác của riêng bạn sắp lộ diện..."
];
