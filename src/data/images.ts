/**
 * مرکز تصاویر پلتفرم
 * ----------------------------------------------------------
 * تمام تصاویر سایت فقط در همین فایل نگهداری می‌شوند.
 * برای تغییر هر تصویر، کافی است مقدار همان کلید را عوض کنید؛
 * هیچ آدرس تصویری در سایر فایل‌ها تکرار نشده است.
 */

const px = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=800`;

export const images = {
  /* هدر و بخش‌های اصلی */
  hero: px(6870324, 1400),
  heroGarage: px(8985517, 1000),
  garageInterior: px(4116291, 1200),
  underBody: px(8986137, 1200),
  nightRoad: px(699829, 1400),
  traffic: px(2075520, 1200),
  highway: px(10277548, 1200),

  /* دسته‌بندی خدمات */
  serviceMechanic: px(4489776, 900),
  serviceOil: px(8985457, 900),
  serviceBody: px(8985456, 900),
  serviceTire: px(9576099, 900),
  serviceElectrical: px(5276374, 900),
  serviceParts: px(8986132, 900),
  serviceWash: px(8985451, 900),
  serviceInspection: px(4022545, 900),
  serviceGlass: px(13387441, 900),
  serviceTowing: px(5276374, 900),

  /* مراکز ضروری و نقشه */
  fuelStation: px(36872836, 900),
  fuelStationAlt: px(32860475, 900),
  fuelStationNight: px(30115431, 900),
  plateCenter: px(8985451, 900),
  inspection: px(4116170, 900),

  /* شناسنامه دیجیتال خودرو */
  dashboard: px(35484520, 1200),
  steering: px(27667633, 1000),
  dashboardDigital: px(28262064, 1000),
  classicCar: px(474, 900),

  /* گالری فروشگاه‌ها (به‌ترتیب در فروشگاه‌ها استفاده می‌شود) */
  gallery: [
    px(4489776, 900),
    px(8985457, 900),
    px(8985456, 900),
    px(5276374, 900),
    px(8986132, 900),
    px(8985451, 900),
    px(4116291, 900),
    px(4116170, 900),
    px(4022545, 900),
    px(8986137, 900),
    px(36353556, 900),
    px(9703056, 900),
  ],
} as const;

export type ImageKey = keyof typeof images;

/** تصویر یک فروشگاه بر اساس اندیس پایدار */
export function storeGallery(index: number, count = 3): string[] {
  const list = images.gallery;
  return Array.from({ length: count }, (_, i) => list[(index + i) % list.length]);
}

export function storeCover(index: number): string {
  return images.gallery[index % images.gallery.length];
}
