import { storage } from "./storage";
import * as cheerio from "cheerio";

export async function injectSEO(html: string, originalUrl: string): Promise<string> {
  // If the URL matches /barcode/:code, we inject specific SEO tags
  const match = originalUrl.match(/^\/barcode\/([^\/?#]+)/);
  if (!match) {
    return html;
  }

  const codeOrId = match[1];
  let barcode;

  try {
    // Replicate the logic from route handler to fetch barcode
    if (codeOrId.match(/^[0-9a-fA-F]{24}$/)) {
      barcode = await storage.getBarcodeById(codeOrId);
    }
    if (!barcode) {
      barcode = await storage.getBarcodeByCode(codeOrId);
    }
  } catch (err) {
    console.error("Error fetching barcode for SEO:", err);
  }

  if (!barcode) {
    // If no barcode found, just return original html or inject a 404 tag
    return html;
  }

  const $ = cheerio.load(html);

  // Default SEO Values
  const title = `${barcode.productName} - Barcode ${barcode.barcode} | Verification`;
  const description = `${barcode.productName} by ${barcode.brandName}. Verify authenticity, check product details, price, and more.`;
  const imageUrl = barcode.imageUrl || "https://shopmybarcode.in/default-share-image.jpg"; // Fallback image needed? Let's use generic ones if we can, or just empty if not available
  const url = `https://shopmybarcode.in${originalUrl}`;

  // Update <title>
  $('title').text(title);

  // Helper to update or append meta tags
  const setMeta = (nameAttr: string, nameValue: string, content: string) => {
    let selector = `meta[name="${nameValue}"]`;
    if (nameAttr === 'property') {
      selector = `meta[property="${nameValue}"]`;
    }

    if ($(selector).length) {
      $(selector).attr("content", content);
    } else {
      $('head').append(`<meta ${nameAttr}="${nameValue}" content="${content}">\n`);
    }
  };

  // Standard Meta
  setMeta("name", "description", description);

  // OpenGraph (Facebook, LinkedIn, Google sometimes)
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:image", imageUrl);
  setMeta("property", "og:url", url);
  setMeta("property", "og:type", "product");

  // Twitter cards
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", imageUrl);

  return $.html();
}
