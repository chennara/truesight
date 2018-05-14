const COLOR_SIMILARITY_THRESHOLD = 7.5;

export default function checkIfSimilarColors(color, color2) {
  return calculateColorSimilarity(color, color2) < COLOR_SIMILARITY_THRESHOLD;
}

function calculateColorSimilarity(color, color2) {
  return Math.sqrt(
    2 * (color.red - color2.red) ** 2 + 4 * (color.green - color2.green) ** 2 + 3 * (color.blue - color2.blue) ** 2
  );
}
