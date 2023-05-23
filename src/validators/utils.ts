export const urlRegex =
  /^https?:\/\/(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?:\/\/(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,}$/;
export const phoneRegex = /^\d{2,3}-\d{7}$/;
export const passwordRegex = /^[a-zA-Z]\w{7,14}$/;
export const fullNameRegex = /^[\p{L}\p{M}\p{Zs}'-]+([\p{Zs}'-][\p{L}\p{M}\p{Zs}'-]+)*$/u;
export const numberRegex = /^\d{6}$/;

export const valMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
export const addressRegex = /^[\p{L}\p{M}\p{Zs}0-9]+$/u;
export const cityRegex = /^[\p{L}\p{M}\p{Zs}]+$/u;
export const isZipRegex = /^\d{7}(?:[-\s]\d{4})?$/;
export const setPermissivecategory = /^(Shirts|shoes|pants)$/;
export const categoryselect2 = /^(מכנסיים קצרים|מכנסיים ארוכים|מכנסיים נילון|חולצות קצרים|חולצות ארוכים|חולצות נילון|נעלי ספורט|נעלי עבודה|נעלי יום)$/;
export const brand = /^(Zara|H&M|Victoria's Secret|Burberry|Tommy Hilfiger|Nike|Adidas|Ralph Lauren|Calvin Klein|Gap|Mango|Ted Baker|Versace|Gucci|Balmain|Dior|Berberry|Louis Vuitton|Armani|Bershka)$/;
export const size = /^(XS|S|M|L|XL|2XL|3XL|4XL|5XL|6XL|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50)$/;
export const color = /^(Red|Blue|Green|Yellow|Orange|Purple|Pink|Brown|Black|White|Gray|Gold|Magenta|Turquoise)$/;
export const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
export const img = /^http:\/\/localhost:3001\/[\w-]+\.(png|jpe?g|gif|svg|webp)$/;

