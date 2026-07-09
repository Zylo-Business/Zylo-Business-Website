export interface Testimonial {
  id: number;
  name: string;
  role: string;
  product: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Pastor Emmanuel K.",
    role: "Senior Pastor, Accra",
    product: "The Pastor's Admin Vault",
    rating: 5,
    text: "I was spending hours every Sunday organizing registers and correspondence. These templates cut my admin time by more than half. Everything is clear and professional — exactly what a growing church needs.",
  },
  {
    id: 2,
    name: "Rev. Chidera O.",
    role: "Church Planter, Lagos",
    product: "The Discipleship Pipeline",
    rating: 5,
    text: "We were running programs but not making disciples. This pipeline gave us a clear structure. Within three months we could track where every member was in their spiritual journey.",
  },
  {
    id: 3,
    name: "Kwame A.",
    role: "Crypto Trader, Kumasi",
    product: "Ghana Crypto Starter Blueprint",
    rating: 5,
    text: "I had tried three exchanges before and lost money to fees and scams. This guide showed me how to use mobile money safely and pick the right P2P platform. My first trade was clean and profitable.",
  },
  {
    id: 4,
    name: "Abena M.",
    role: "Trader and Nurse, Takoradi",
    product: "The Drawdown Shield",
    rating: 5,
    text: "I kept blowing my account because I was emotional. The spreadsheet literally locks me out of bad trades by showing me my risk in real time. I have not had a blow-up month since I started using it.",
  },
  {
    id: 5,
    name: "Nana Yaw B.",
    role: "Self-taught Developer, Accra",
    product: "Python for Traders",
    rating: 5,
    text: "I had zero coding background. By session three I had a working Telegram bot sending me Bitcoin price alerts every hour. The explanations are clear and the examples actually make sense for someone in Ghana.",
  },
  {
    id: 6,
    name: "Kofi D.",
    role: "Lottery Enthusiast, Cape Coast",
    product: "LottoScan Pro Spreadsheet",
    rating: 4,
    text: "I used to pick numbers randomly. Now I update the frequency table every week and choose based on patterns. I won a smaller prize twice in the last two months. The honest framing about probability is refreshing.",
  },
];

export default testimonials;
