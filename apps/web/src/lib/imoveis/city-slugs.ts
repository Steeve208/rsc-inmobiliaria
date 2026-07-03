/** Major cities for SEO landing pages → search filters */
export const cityLandingPages: { slug: string; city: string; state: string }[] = [
  { slug: "sao-paulo", city: "São Paulo", state: "SP" },
  { slug: "rio-de-janeiro", city: "Rio de Janeiro", state: "RJ" },
  { slug: "belo-horizonte", city: "Belo Horizonte", state: "MG" },
  { slug: "curitiba", city: "Curitiba", state: "PR" },
  { slug: "porto-alegre", city: "Porto Alegre", state: "RS" },
  { slug: "florianopolis", city: "Florianópolis", state: "SC" },
  { slug: "brasilia", city: "Brasília", state: "DF" },
  { slug: "salvador", city: "Salvador", state: "BA" },
  { slug: "recife", city: "Recife", state: "PE" },
  { slug: "fortaleza", city: "Fortaleza", state: "CE" },
];

export function resolveCitySlug(slug: string) {
  return cityLandingPages.find((entry) => entry.slug === slug);
}
