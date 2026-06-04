import axios from "axios";

const API_BASE_URL = "https://admin-ybs9.onrender.com";

const cleanTestimonials = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/testimonials`);
    const testimonials = res.data.testimonials || [];
    console.log(`Found ${testimonials.length} testimonials.`);

    for (const t of testimonials) {
      if (t.mediaType === "image" || (!t.mediaUrl.includes("video") && t.mediaType !== "video")) {
        console.log(`Deleting image testimonial: ${t.name} (${t.id})`);
        await axios.delete(`${API_BASE_URL}/api/testimonials/${t.id}`);
      }
    }
    console.log("Cleanup complete!");
  } catch (e) {
    console.error("Failed to clean testimonials", e.message);
  }
};

cleanTestimonials();
