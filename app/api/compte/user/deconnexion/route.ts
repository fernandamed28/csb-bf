export async function POST() {
  // Ici tu pourrais aussi gérer la suppression d'un cookie côté serveur si besoin
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}