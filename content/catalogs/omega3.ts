export interface Omega3VariantPrice {
  grossPrice: number;
  netPrice: number;
}

export interface Omega3SpecItem {
  label: string;
  value: string;
}

export interface Omega3CatalogVariant {
  id: string;
  model: string;
  lead: string;
  description: string;
  story: string;
  shortFlow: string;
  dimensions: string;
  weight: string;
  pricing: Omega3VariantPrice;
  benefits: string[];
  differentiators: string[];
  specs: Omega3SpecItem[];
}

export interface Omega3CatalogTile {
  id: string;
  label: string;
  family: string;
  image: string;
  imageAlt: string;
  lead: string;
  summary: string;
  story: string;
  quickFacts: string[];
  benefits: string[];
  highlights: string[];
  variants: Omega3CatalogVariant[];
}

export interface Omega3CatalogSection {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  rangeLabel: string;
  featured: Omega3CatalogTile;
  siblings: Omega3CatalogTile[];
}

export interface Omega3CatalogRow {
  id: string;
  model: string;
  line: string;
  family: string;
  summary: string;
  image: string;
  grossPrice: number;
  netPrice: number;
  briefSpec: string;
}

export const formatPln = (value: number): string =>
  new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const CATALOG_IMAGE_PATH = '/images/catalog/omega3/2026';

const image = (fileName: string) => `${CATALOG_IMAGE_PATH}/${fileName}`;
const spec = (label: string, value: string): Omega3SpecItem => ({ label, value });
const price = (grossPrice: number, netPrice: number): Omega3VariantPrice => ({
  grossPrice,
  netPrice,
});

export const omega3CatalogMeta = {
  editionDate: '2026-04-10',
  title: 'Technologia Molekularna Omega-3 2026',
  subtitle:
    'Katalog urządzeń wodorowych Omega-3 w układzie czterech linii: osobistej, intensywnej, zaawansowanej i wodorowej, z aktualnym cennikiem brutto i netto.',
  disclaimer:
    'Katalog ma charakter informacyjny i handlowy. Oznaczenia AQ, PR, ZA i OS odpowiadają edycji Omega-3 2026; w materiałach producenta część platform może występować pod oznaczeniami fabrycznymi. Parametry techniczne pochodzą z katalogu Omega-3 2026 oraz materiałów producenta i należy je każdorazowo zestawić z instrukcją oraz warunkami instalacyjnymi.',
  highlights: [
    '22 modele uporządkowane w czterech liniach produktowych',
    'Aktualne ceny katalogowe netto i brutto dla edycji 2026',
    'Rozbudowane opisy premium dopasowane do rozmów B2B i klienta premium',
    'Nazewnictwo AQ / PR / ZA / OS zgodne z bieżącą edycją katalogu',
  ],
  hero: {
    label: 'PR-HO900 / PR-HO1500 / PR-HO1800',
    family: 'Linia intensywna · rodzina H2 + O2',
    priceFrom: 7990,
    image: image('pr-ho900-1800.png'),
    imageAlt: 'Rodzina modeli PR-HO900, PR-HO1500 i PR-HO1800',
  },
  contact: {
    phone: '+48 607 874 746',
    email: 'delta@delta3.pl',
    address: 'ul. PCK 2b, 42-218 Częstochowa',
  },
} as const;

export const omega3CatalogSections: Omega3CatalogSection[] = [
  {
    id: 'linia-osobista',
    kicker: '01 · Linia osobista',
    title: 'Linia Osobista',
    summary:
      'Linia osobista porządkuje urządzenia, które wprowadzają wodór do codziennej rutyny w najbardziej kameralnym, prywatnym formacie. To sprzęt dla domu, dla pierwszego świadomego wejścia w kategorię i dla klientów, którzy chcą zacząć elegancko, bez technicznego ciężaru.',
    rangeLabel: '150–450 ml/min · format biurkowy i kompakt premium',
    featured: {
      id: 'os-h150-family',
      label: 'OS-H150',
      family: 'Osobisty inhalator domowy',
      image: image('os-h150.png'),
      imageAlt: 'Model OS-H150',
      lead: 'Najbardziej prywatny początek linii Omega-3.',
      summary:
        'OS-H150 został pomyślany jako spokojny, osobisty start: urządzenie o czystej bryle, które nie dominuje wnętrza, a jednocześnie daje użytkownikowi poczucie wejścia w kategorię na poziomie premium.',
      story:
        'To model dla osób, które chcą, aby technologia wodoru weszła do życia w sposób naturalny i dyskretny. Zamiast gabinetowego ciężaru oferuje rytm spokojnego, prywatnego użycia w domowym otoczeniu.',
      quickFacts: ['H2 150 ml/min', '70 W', '17 × 17 × 28 cm', '2 590,00 PLN brutto'],
      benefits: [
        'Dyskretny format do sypialni, gabinetu lub prywatnej strefy wellness w domu.',
        'Przejrzysty próg wejścia dla klienta, który kupuje pierwsze urządzenie wodorowe.',
        'Niewielki ślad przestrzenny i szybkie oswojenie z codziennym rytuałem pracy ze sprzętem.',
      ],
      highlights: [
        'kompaktowa pionowa bryła',
        'najbardziej intymny format w całym katalogu',
        'czytelny punkt wejścia do linii OS',
      ],
      variants: [
        {
          id: 'os-h150',
          model: 'OS-H150',
          lead: 'Prywatny rytuał wodoru w wersji najbardziej osobistej.',
          description:
            'To urządzenie stworzone dla codziennych sesji w domowym otoczeniu, kiedy liczy się prostota, spójna estetyka i pełna kontrola nad tempem wejścia w technologię.',
          story:
            'OS-H150 najlepiej odnajduje się tam, gdzie urządzenie ma pracować blisko użytkownika i pozostać częścią uporządkowanego wnętrza, a nie dominującym elementem technicznym.',
          shortFlow: 'H2 150 ml/min',
          dimensions: '17 × 17 × 28 cm',
          weight: '4 kg',
          pricing: price(2590, 2105.69),
          benefits: [
            'Łagodne wejście w kategorię dla użytkownika indywidualnego.',
            'Prosty rytm pracy bez poczucia obcowania z dużą stacją techniczną.',
            'Dobry wybór do spokojnych, powtarzalnych sesji domowych.',
          ],
          differentiators: [
            'Najmniejszy format w linii osobistej.',
            'Wysoka kultura wizualna w małej bryle.',
            'Model ustawiony na komfort pojedynczego użytkownika.',
          ],
          specs: [
            spec('Gaz', 'czysty wodór'),
            spec('Przepływ', '150 ml/min'),
            spec('Moc', '70 W'),
            spec('Zbiornik', '300 ml'),
            spec('Wymiary', '17 × 17 × 28 cm'),
            spec('Waga', '4 kg'),
          ],
        },
      ],
    },
    siblings: [
      {
        id: 'os-h200-300-family',
        label: 'OS-H200 / OS-H300',
        family: 'Osobista platforma rozszerzona',
        image: image('os-h200-300.png'),
        imageAlt: 'Modele OS-H200 i OS-H300',
        lead: 'Dwie odsłony tego samego domowego luksusu: więcej wydajności, ta sama prostota obcowania.',
        summary:
          'Rodzina OS-H200 / OS-H300 zachowuje przyjazny charakter linii osobistej, ale daje klientowi wybór między spokojniejszym profilem pracy a mocniejszą, bardziej dynamiczną wersją kompaktowej platformy.',
        story:
          'To propozycja dla klientów, którzy chcą zostać w świecie urządzeń osobistych, ale oczekują już większej rezerwy przepływu i bardziej zdecydowanej obecności sprzętu w codziennym rytmie.',
        quickFacts: ['H2 200 lub 300 ml/min', '22 × 36 cm', '6 kg', 'od 3 390,00 PLN brutto'],
        benefits: [
          'Ten sam elegancki korpus pozwala dobrać intensywność bez zmiany charakteru urządzenia.',
          'Świetny wybór dla domu premium, apartamentu wellness albo kameralnego showroomu.',
          'Czytelny skok wydajności przy zachowaniu prostego, domowego języka obsługi.',
        ],
        highlights: [
          'wspólna platforma OS-H200 / OS-H300',
          'większa stabilność pracy niż w modelu wejściowym',
          'rozszerzona linia do bardziej regularnych sesji',
        ],
        variants: [
          {
            id: 'os-h200',
            model: 'OS-H200',
            lead: 'Subtelny upgrade dla tych, którzy chcą więcej bez zmiany stylu korzystania.',
            description:
              'OS-H200 pozostaje urządzeniem osobistym w odbiorze, ale oferuje większą rezerwę przepływu i bardziej zdecydowaną obecność w codziennym planie użytkowania.',
            story:
              'To naturalny krok po modelu wejściowym: nadal domowy, nadal uporządkowany, ale bardziej pewny i stabilny w rytmie częstego korzystania.',
            shortFlow: 'H2 200 ml/min',
            dimensions: '22 × 36 cm',
            weight: '6 kg',
            pricing: price(3390, 2756.1),
            benefits: [
              'Większy komfort dla użytkowników sięgających po sprzęt częściej w tygodniu.',
              'Spokojna forma dla domowych wnętrz premium.',
              'Dobry balans między prostotą a poczuciem wyższej klasy technicznej.',
            ],
            differentiators: [
              'Rozszerzona platforma osobista OS.',
              'Większy przepływ bez utraty kompaktowego charakteru.',
              'Format gotowy do prywatnego, regularnego użycia.',
            ],
            specs: [
              spec('Gaz', 'czysty wodór'),
              spec('Przepływ', '200 ml/min'),
              spec('Moc', '120 W'),
              spec('Zbiornik', '1200 ml'),
              spec('Wymiary', '22 × 36 cm'),
              spec('Waga', '6 kg'),
            ],
          },
          {
            id: 'os-h300',
            model: 'OS-H300',
            lead: 'Najmocniejszy akcent linii osobistej bez wychodzenia z kameralnej skali.',
            description:
              'OS-H300 jest propozycją dla klientów, którzy chcą zachować intymny, domowy format urządzenia, ale oczekują już bardziej wyrazistej wydajności w codziennych sesjach.',
            story:
              'W praktyce to model, który zostaje w tej samej estetyce co OS-H200, lecz odpowiada bardziej zdecydowanym oczekiwaniom wobec intensywności i rytmu pracy.',
            shortFlow: 'H2 300 ml/min',
            dimensions: '22 × 36 cm',
            weight: '6 kg',
            pricing: price(4690, 3813.01),
            benefits: [
              'Najwyższa wydajność w rodzinie OS bez przejścia do większych stacji.',
              'Naturalny wybór dla użytkownika, który chce zostać przy osobistym formacie.',
              'Większa dynamika pracy przy zachowaniu czytelnej obsługi.',
            ],
            differentiators: [
              'Topowa wydajność linii OS.',
              'Wspólny korpus z OS-H200, mocniejszy charakter pracy.',
              'Kompaktowy profil dla domu premium i prywatnego gabinetu.',
            ],
            specs: [
              spec('Gaz', 'czysty wodór'),
              spec('Przepływ', '300 ml/min'),
              spec('Platforma', 'rozszerzona seria OS'),
              spec('Format', 'kompakt domowy'),
              spec('Wymiary', '22 × 36 cm'),
              spec('Waga', '6 kg'),
            ],
          },
        ],
      },
      {
        id: 'pr-ho450-p-family',
        label: 'PR-HO450-P',
        family: 'Pulsacyjny model kompakt premium',
        image: image('pr-ho450-p.png'),
        imageAlt: 'Model PR-HO450-P',
        lead: 'Model dla klienta, który chce poczuć wyższy poziom wyrafinowania już w kompaktowej skali.',
        summary:
          'PR-HO450-P łączy elegancję małego formatu z pulsacyjną architekturą pracy H2 + O2. To urządzenie dla osób, które chcą wejść w bardziej dopracowaną, gabinetowo-domową klasę jeszcze przed przejściem do linii intensywnej.',
        story:
          'W tej karcie linia osobista domyka się najmocniej: z większą ceremonialnością pracy, bardziej premium odczuciem obsługi i techniką, która daje już wyraźnie inny charakter niż urządzenia czysto wejściowe.',
        quickFacts: ['H2 300 ml/min', 'O2 150 ml/min', '15 × 18 × 26 cm', '7 290,00 PLN brutto'],
        benefits: [
          'Pulsacyjny sposób pracy dla osób, które szukają bardziej zaawansowanego doświadczenia już na etapie kompaktowym.',
          'Spójny pomost między osobistym rytuałem a półprofesjonalnym językiem urządzenia.',
          'Wyrazisty model do domu premium, prywatnego gabinetu lub rozmów pokazowych.',
        ],
        highlights: [
          'pulsacyjna architektura H2 + O2',
          'format łączący dom i mały gabinet',
          'najbardziej luksusowe domknięcie linii osobistej',
        ],
        variants: [
          {
            id: 'pr-ho450-p',
            model: 'PR-HO450-P',
            lead: 'Kompakt premium z pulsacyjnym rytmem pracy.',
            description:
              'Model buduje poczucie większej ceremonii użycia: nadal pozostaje kompaktowy, ale daje użytkownikowi bardziej dopracowany, technicznie świadomy profil pracy H2 + O2.',
            story:
              'PR-HO450-P sprawdza się tam, gdzie klient oczekuje czegoś więcej niż klasycznego modelu osobistego, ale nadal chce zachować spokój małej, eleganckiej bryły.',
            shortFlow: 'H2 300 ml/min · O2 150 ml/min',
            dimensions: '15 × 18 × 26 cm',
            weight: '5 kg',
            pricing: price(7290, 5926.83),
            benefits: [
              'Wyraźniej zarysowany charakter premium w małym korpusie.',
              'Format gotowy zarówno do domu, jak i do kameralnego gabinetu.',
              'Poczucie technicznego awansu bez skoku do dużej stacji.',
            ],
            differentiators: [
              'Tryb pulsacyjny z magazynowaniem gazu podczas wydechu.',
              'Mieszanka H2 + O2 w proporcji katalogowej 2:1.',
              'Najbardziej wyrafinowany model w linii osobistej.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '300 ml/min'),
              spec('O2', '150 ml/min'),
              spec('Tryb', 'pulsacyjny'),
              spec('Wymiary', '15 × 18 × 26 cm'),
              spec('Waga', '5 kg'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'linia-intensywna',
    kicker: '02 · Linia intensywna',
    title: 'Linia Intensywna',
    summary:
      'Linia intensywna została ułożona dla klientów, którzy chcą już pracować częściej, pewniej i z większą rezerwą przepływu. To obszar urządzeń dla domu premium, studia treningowego, prywatnego gabinetu i przestrzeni, w której wodór ma być obecny regularnie, a nie okazjonalnie.',
    rangeLabel: '600–3000 ml/min · dom, showroom, gabinet i rytm tygodniowy',
    featured: {
      id: 'pr-h600-family',
      label: 'PR-H600',
      family: 'Intensywna linia czystego wodoru',
      image: image('pr-h600.png'),
      imageAlt: 'Model PR-H600',
      lead: 'Pierwszy model, który naprawdę czuje się jak stacja do częstego użycia.',
      summary:
        'PR-H600 otwiera linię intensywną z energią wyraźnie większego urządzenia: stabilniejszego, bardziej konsekwentnego i gotowego do regularnej pracy w domu lub w małym gabinecie.',
      story:
        'To model dla użytkownika, który wie już, że wodór ma pozostać stałym elementem planu dnia. Nie jest demonstracją technologii, lecz narzędziem do konsekwentnego rytuału.',
      quickFacts: ['H2 600 ml/min', '300 W', '40 × 40 × 20 cm', '6 990,00 PLN brutto'],
      benefits: [
        'Wyższa wydajność dla regularnych sesji bez przechodzenia do ciężkiej stacji pro.',
        'Bardziej dojrzała obecność urządzenia we wnętrzu i w codziennym harmonogramie pracy.',
        'Format gotowy do rozmów z klientem, który oczekuje klasy wyższej niż w linii osobistej.',
      ],
      highlights: [
        'czysty wodór w formacie intensywnym',
        'pierwsza wyraźnie gabinetowa skala pracy',
        'solidny model do częstego wykorzystania',
      ],
      variants: [
        {
          id: 'pr-h600',
          model: 'PR-H600',
          lead: 'Czysty wodór w formacie dojrzałego, regularnego użytkowania.',
          description:
            'PR-H600 daje użytkownikowi poczucie wejścia w kategorię urządzeń, które mają pracować konsekwentnie i przewidywalnie, a nie tylko okazjonalnie.',
          story:
            'To model dla klientów, którzy chcą urządzenia o poważniejszej kulturze pracy, ale nadal na poziomie, który pozostaje przyjazny domowi i kameralnym przestrzeniom usługowym.',
          shortFlow: 'H2 600 ml/min',
          dimensions: '40 × 40 × 20 cm',
          weight: '11 kg',
          pricing: price(6990, 5682.93),
          benefits: [
            'Większa rezerwa przepływu dla bardziej regularnych sesji.',
            'Naturalny wybór dla domu premium i małego gabinetu.',
            'Stabilny model do rozmów z klientem świadomym jakości urządzenia.',
          ],
          differentiators: [
            'Czysty wodór bez mieszanki tlenowej.',
            'Format do częstego użycia w tygodniu.',
            'Wyraźnie dojrzalsza platforma niż linia osobista.',
          ],
          specs: [
            spec('Gaz', 'czysty wodór'),
            spec('Przepływ', '600 ml/min'),
            spec('Moc', '300 W'),
            spec('Zbiornik', '2500 ml'),
            spec('Wymiary', '40 × 40 × 20 cm'),
            spec('Waga', '11 kg'),
          ],
        },
      ],
    },
    siblings: [
      {
        id: 'pr-ho-family',
        label: 'PR-HO900 / PR-HO1500 / PR-HO1800',
        family: 'Domowo-gabinetowa platforma H2 + O2',
        image: image('pr-ho900-1800.png'),
        imageAlt: 'Rodzina modeli PR-HO900, PR-HO1500 i PR-HO1800',
        lead: 'Jedna rodzina, trzy poziomy intensywności, ten sam premium feeling pracy ze sprzętem.',
        summary:
          'Ta platforma odpowiada za najważniejszy środek ciężkości katalogu: urządzenia do częstych sesji H2 + O2, które równie dobrze wyglądają w domu premium, jak i w eleganckim gabinecie pokazowym.',
        story:
          'To rodzina dla klienta, który nie kupuje już pierwszego urządzenia. Szuka raczej skali, która da się dobrać do realnego rytmu użycia bez utraty elegancji i bez przejścia do infrastruktury stricte profesjonalnej.',
        quickFacts: [
          'H2 + O2 2:1',
          '600 / 300 do 1200 / 600 ml/min',
          '40 × 40 × 20 cm',
          'od 7 990,00 PLN brutto',
        ],
        benefits: [
          'Czytelna drabina wydajności bez zmiany charakteru całej platformy.',
          'Gotowość do częstego użycia w przestrzeniach, gdzie liczy się zarówno estetyka, jak i wydajność.',
          'Świetna rodzina do sprzedaży doradczej: klient wybiera nie styl, lecz właściwą skalę pracy.',
        ],
        highlights: [
          'wspólny język projektowy dla trzech progów wydajności',
          'mieszanka H2 + O2 dla pracy wieloscesyjnej',
          'najbardziej uniwersalna rodzina w całym katalogu',
        ],
        variants: [
          {
            id: 'pr-ho900',
            model: 'PR-HO900',
            lead: 'Najlżejszy próg wejścia do rodziny H2 + O2 o intensywnym charakterze.',
            description:
              'Model daje już pełne odczucie linii intensywnej, ale pozostaje najbardziej miękkim wejściem w tę rodzinę dla użytkownika, który dopiero buduje swój rytm częstych sesji.',
            story:
              'To wariant bardzo elegancki w sprzedaży: pokazuje wyraźny skok klasowy względem kompaktów, a jednocześnie nie jest jeszcze nadmiarem mocy dla prywatnego użytkownika.',
            shortFlow: 'H2 600 ml/min · O2 300 ml/min',
            dimensions: '40 × 40 × 20 cm',
            weight: '11 kg',
            pricing: price(7990, 6495.93),
            benefits: [
              'Najbardziej przystępny start w rodzinie PR-HO.',
              'Doskonały balans między intensywnością a codzienną wygodą.',
              'Model lubiany tam, gdzie liczy się elegancki kompromis.',
            ],
            differentiators: [
              'Wejściowy wariant rodziny PR-HO.',
              'Gaz H2 + O2 w proporcji katalogowej.',
              'Wspólna platforma estetyczna z mocniejszymi wariantami.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '600 ml/min'),
              spec('O2', '300 ml/min'),
              spec('Moc', '360 W'),
              spec('Wymiary', '40 × 40 × 20 cm'),
              spec('Waga', '11 kg'),
            ],
          },
          {
            id: 'pr-ho1500',
            model: 'PR-HO1500',
            lead: 'Środkowy punkt równowagi między luksusem obsługi a wyższą rezerwą wydajności.',
            description:
              'PR-HO1500 jest tym wariantem, po który sięga klient, gdy urządzenie ma być realnie obecne w tygodniowym planie, a nie tylko stanowić premium eksperyment.',
            story:
              'To model, który często staje się naturalnym faworytem: daje poczucie wejścia w klasę naprawdę dojrzałą, ale nadal zachowuje codzienną łatwość obcowania.',
            shortFlow: 'H2 1000 ml/min · O2 500 ml/min',
            dimensions: '40 × 40 × 20 cm',
            weight: '12 kg',
            pricing: price(10290, 8365.85),
            benefits: [
              'Bardzo mocny kompromis dla wymagającego użytkownika prywatnego.',
              'Dobra rezerwa do częstego użytkowania w gabinecie premium.',
              'Wyższa skala bez przejścia do ciężkich platform zaawansowanych.',
            ],
            differentiators: [
              'Najczęściej wybierany środek rodziny PR-HO.',
              'Wyraźnie większy przepływ przy tej samej logice obsługi.',
              'Klasa urządzenia do pracy częstej i powtarzalnej.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '1000 ml/min'),
              spec('O2', '500 ml/min'),
              spec('Moc', '400 W'),
              spec('Wymiary', '40 × 40 × 20 cm'),
              spec('Waga', '12 kg'),
            ],
          },
          {
            id: 'pr-ho1800',
            model: 'PR-HO1800',
            lead: 'Najmocniejszy niepulsacyjny akcent linii intensywnej.',
            description:
              'PR-HO1800 zamyka rodzinę standardową z poczuciem pełnej dojrzałości: to wariant dla klientów, którzy nie chcą jeszcze przechodzić do linii zaawansowanej, ale oczekują już najwyższej intensywności tej platformy.',
            story:
              'W rozmowie handlowej jest to model, który buduje autorytet całej rodziny: pokazuje, jak daleko można dojść bez wychodzenia poza estetyczny, domowo-gabinetowy format.',
            shortFlow: 'H2 1200 ml/min · O2 600 ml/min',
            dimensions: '40 × 40 × 20 cm',
            weight: '12 kg',
            pricing: price(11290, 9178.86),
            benefits: [
              'Najwyższy standardowy przepływ w rodzinie PR-HO.',
              'Bardzo mocna obecność w gabinecie i salonie pokazowym.',
              'Model dla klienta, który chce maksimum z tej formy urządzenia.',
            ],
            differentiators: [
              'Topowy wariant rodziny PR-HO.',
              'Wydajność dla klientów z wyższymi oczekiwaniami względem rytmu pracy.',
              'Format nadal elegancki i przyjazny dla wnętrza premium.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '1200 ml/min'),
              spec('O2', '600 ml/min'),
              spec('Moc', '500 W'),
              spec('Wymiary', '40 × 40 × 20 cm'),
              spec('Waga', '12 kg'),
            ],
          },
        ],
      },
      {
        id: 'pr-ho-p-family',
        label: 'PR-HO900-P / PR-HO1800-P / PR-HO3000-P',
        family: 'Pulsacyjna linia intensywna',
        image: image('pr-ho-p-family.png'),
        imageAlt: 'Rodzina modeli PR-HO900-P, PR-HO1800-P i PR-HO3000-P',
        lead: 'Pulsacyjna odsłona linii intensywnej dla klientów, którzy chcą wejść w bardziej techniczny, bardziej ceremonialny format pracy.',
        summary:
          'Rodzina z dopiskiem -P wnosi do linii intensywnej inny charakter doświadczenia: bardziej precyzyjny, bardziej instrumentalny, przeznaczony dla osób, które chcą już świadomie dobrać sposób pracy urządzenia do własnego rytmu oddechowego.',
        story:
          'To propozycja dla świadomego klienta premium. Nie chodzi tu wyłącznie o większą moc, lecz także o wrażenie kontaktu z urządzeniem bardziej wyspecjalizowanym, niemal gabinetowym w charakterze.',
        quickFacts: [
          'Pulsacyjny tryb H2 + O2',
          '600 / 300 do 2000 / 1000 ml/min',
          '14 × 27 × 45 cm',
          'od 9 490,00 PLN brutto',
        ],
        benefits: [
          'Pulsacyjna architektura pracy daje tej rodzinie bardzo wyraźny premium signature.',
          'Smukły pionowy korpus dobrze prezentuje się w prywatnym gabinecie i w strefie pokazowej.',
          'To linia dla klientów, którzy chcą mówić o urządzeniu językiem precyzji, a nie tylko przepływu.',
        ],
        highlights: [
          'tryb pulsacyjny w całej rodzinie',
          'smukła pionowa bryła',
          'najbardziej specjalistyczne domknięcie linii intensywnej',
        ],
        variants: [
          {
            id: 'pr-ho900-p',
            model: 'PR-HO900-P',
            lead: 'Pulsacyjny próg wejścia do wyspecjalizowanej pracy H2 + O2.',
            description:
              'Model dla klienta, który chce czuć różnicę nie tylko w parametrach, lecz także w samym charakterze urządzenia i jego sposobie pracy.',
            story:
              'PR-HO900-P dobrze działa w sprzedaży doradczej jako pierwszy krok w stronę bardziej technicznego, świadomego doświadczenia z linią PR.',
            shortFlow: 'H2 600 ml/min · O2 300 ml/min',
            dimensions: '14 × 27 × 45 cm',
            weight: '11 kg',
            pricing: price(9490, 7715.45),
            benefits: [
              'Pulsacyjny sposób pracy w najbardziej przystępnym wariancie rodziny -P.',
              'Smukły korpus dla eleganckiej ekspozycji we wnętrzu premium.',
              'Świetny model wejściowy do komunikacji o linii wyspecjalizowanej.',
            ],
            differentiators: [
              'Tryb pulsacyjny z magazynowaniem gazu podczas wydechu.',
              'Najlżejszy wariant w rodzinie -P.',
              'Wysoka kultura pracy w pionowej bryle.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '600 ml/min'),
              spec('O2', '300 ml/min'),
              spec('Tryb', 'pulsacyjny'),
              spec('Wymiary', '14 × 27 × 45 cm'),
              spec('Waga', '11 kg'),
            ],
          },
          {
            id: 'pr-ho1800-p',
            model: 'PR-HO1800-P',
            lead: 'Środkowy wariant dla klientów oczekujących bardziej zdecydowanej, pulsacyjnej skali pracy.',
            description:
              'PR-HO1800-P podnosi klasę intensywności bez zmiany eleganckiego, smukłego charakteru urządzenia. To bardzo atrakcyjna propozycja dla prywatnych gabinetów premium.',
            story:
              'Jest to model dla tych, którzy nie chcą już kompromisu pomiędzy estetyką a bardziej zaawansowaną logiką pracy urządzenia.',
            shortFlow: 'H2 1200 ml/min · O2 600 ml/min',
            dimensions: '14 × 27 × 45 cm',
            weight: '11 kg',
            pricing: price(13490, 10967.48),
            benefits: [
              'Wyraźny wzrost intensywności przy zachowaniu tej samej bryły.',
              'Mocny wybór do codziennej pracy w prywatnym gabinecie premium.',
              'Urządzenie o bardzo przekonującym charakterze demonstracyjnym.',
            ],
            differentiators: [
              'Środkowy wariant rodziny pulsacyjnej.',
              'Bardziej zdecydowana skala pracy niż w PR-HO900-P.',
              'Ten sam smukły korpus, bardziej wyraźna obecność wydajnościowa.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '1200 ml/min'),
              spec('O2', '600 ml/min'),
              spec('Tryb', 'pulsacyjny'),
              spec('Wymiary', '14 × 27 × 45 cm'),
              spec('Waga', '11 kg'),
            ],
          },
          {
            id: 'pr-ho3000-p',
            model: 'PR-HO3000-P',
            lead: 'Kulminacja pulsacyjnej rodziny intensywnej przed wejściem w segment zaawansowany.',
            description:
              'To najmocniejszy akcent rodziny -P: model dla klienta, który chce wyraźnie odczuć przewagę skali, ale nadal ceni pionowy, zgrabny format urządzenia.',
            story:
              'PR-HO3000-P robi wrażenie nie tylko parametrem, lecz także stylem obecności. To sprzęt, który wygląda jak świadomie wybrany instrument pracy, a nie przypadkowa stacja techniczna.',
            shortFlow: 'H2 2000 ml/min · O2 1000 ml/min',
            dimensions: '14 × 27 × 45 cm',
            weight: '11 kg',
            pricing: price(18490, 15032.52),
            benefits: [
              'Najmocniejszy wariant rodziny -P.',
              'Silna obecność premium w gabinecie pokazowym lub prywatnej strefie oddechowej.',
              'Model dla klientów, którzy lubią technikę dopracowaną i świadomie wybraną.',
            ],
            differentiators: [
              'Topowy wariant pulsacyjnej linii intensywnej.',
              'Bardzo wysoka skala pracy w kompaktowo-smukłej obudowie.',
              'Silny argument dla segmentu premium i B2B.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '2000 ml/min'),
              spec('O2', '1000 ml/min'),
              spec('Tryb', 'pulsacyjny'),
              spec('Wymiary', '14 × 27 × 45 cm'),
              spec('Waga', '11 kg'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'linia-zaawansowana',
    kicker: '03 · Linia zaawansowana',
    title: 'Linia Zaawansowana',
    summary:
      'Linia zaawansowana skupia urządzenia dla środowisk, w których wodór ma już pracować z dużą konsekwencją, w większej skali i przy wyższym obciążeniu. To segment dla gabinetów, showroomów, przestrzeni regeneracyjnych i klientów, którzy chcą wejść w poziom naprawdę wysokiej wydajności.',
    rangeLabel: '3000–6000 ml/min · gabinet, showroom i stacja high-output',
    featured: {
      id: 'za-ho3000-3600-family',
      label: 'ZA-HO3000 / ZA-HO3600',
      family: 'Zaawansowana platforma high-output',
      image: image('za-ho3000-3600.png'),
      imageAlt: 'Modele ZA-HO3000 i ZA-HO3600',
      lead: 'Dwie stacje, które wprowadzają linię zaawansowaną w poziom realnie gabinetowy.',
      summary:
        'ZA-HO3000 i ZA-HO3600 budują wejście do segmentu zaawansowanego: urządzeń o mocnej obecności technicznej, dużej rezerwie przepływu i formacie, który od razu komunikuje wyższą klasę wdrożenia.',
      story:
        'To rodzina dla klientów, którzy chcą mieć w przestrzeni sprzęt wyraźnie profesjonalny, ale nadal elegancki i uporządkowany wizualnie. Każdy z modeli niesie inne tempo pracy, lecz oba pozostają w jednym świecie premium.',
      quickFacts: [
        'H2 + O2 high-output',
        '2000 / 1000 do 2400 / 1200 ml/min',
        '34 × 26 × 46 cm lub 34 × 30 × 64 cm',
        'od 15 290,00 PLN brutto',
      ],
      benefits: [
        'Wejście w prawdziwie gabinetową skalę pracy bez utraty jakości prezentacji.',
        'Bardzo mocna pozycja w przestrzeniach premium, gdzie urządzenie ma wyglądać jak świadomy wybór technologiczny.',
        'Rodzina z naturalnym potencjałem sprzedażowym dla klientów wymagających większej rezerwy niż w linii intensywnej.',
      ],
      highlights: [
        'segment high-output dla wdrożeń stacjonarnych',
        'wyraźnie profesjonalna obecność wizualna',
        'początek linii zaawansowanej w dwóch skalach mocy',
      ],
      variants: [
        {
          id: 'za-ho3000',
          model: 'ZA-HO3000',
          lead: 'Pierwsza zaawansowana stacja dla klienta, który chce wejść w realną skalę gabinetową.',
          description:
            'ZA-HO3000 otwiera segment stacji high-output z poczuciem technicznej pewności i dużej, profesjonalnej obecności we wnętrzu.',
          story:
            'To model dla przestrzeni, które chcą wyglądać poważnie i pracować na poziomie wyraźnie wyższym niż domowo-gabinetowa linia intensywna.',
          shortFlow: 'H2 2000 ml/min · O2 1000 ml/min',
          dimensions: '34 × 26 × 46 cm',
          weight: '15 kg',
          pricing: price(15290, 12430.89),
          benefits: [
            'Profesjonalny próg wejścia do linii ZA.',
            'Bardzo dobra równowaga między skalą a wciąż zwartym formatem stacji.',
            'Model dobrze prezentujący się w gabinecie premium i showroomie.',
          ],
          differentiators: [
            'Wejściowy wariant rodziny ZA.',
            'Wysoka wydajność przy bardziej kompaktowej z dwóch brył.',
            'Stacja projektowana pod wyższy rytm pracy.',
          ],
          specs: [
            spec('Gaz', 'wodór + tlen'),
            spec('H2', '2000 ml/min'),
            spec('O2', '1000 ml/min'),
            spec('Platforma mocy', '900 W'),
            spec('Wymiary', '34 × 26 × 46 cm'),
            spec('Waga', '15 kg'),
          ],
        },
        {
          id: 'za-ho3600',
          model: 'ZA-HO3600',
          lead: 'Większa, cięższa i bardziej zdecydowana stacja dla przestrzeni o wyższych oczekiwaniach.',
          description:
            'ZA-HO3600 rozwija język rodziny ZA w stronę jeszcze większej rezerwy przepływu i bardziej imponującej obecności sprzętu w przestrzeni usługowej.',
          story:
            'To wariant dla miejsc, które chcą nie tylko wydajności, ale też urządzenia wyglądającego jak flagowy punkt technologiczny strefy regeneracyjnej.',
          shortFlow: 'H2 2400 ml/min · O2 1200 ml/min',
          dimensions: '34 × 30 × 64 cm',
          weight: '26 kg',
          pricing: price(18290, 14869.92),
          benefits: [
            'Wyższa rezerwa pracy dla bardziej wymagających środowisk.',
            'Bardzo mocna wizualna obecność w strefie premium.',
            'Urządzenie dla miejsc, które chcą komunikować zaawansowanie bez słów.',
          ],
          differentiators: [
            'Mocniejsza i większa bryła niż ZA-HO3000.',
            'Rozbudowana skala pracy dla intensywniejszego harmonogramu.',
            'Naturalny pomost do flagowego ZA-HO6000.',
          ],
          specs: [
            spec('Gaz', 'wodór + tlen'),
            spec('H2', '2400 ml/min'),
            spec('O2', '1200 ml/min'),
            spec('Platforma mocy', '1000 W'),
            spec('Wymiary', '34 × 30 × 64 cm'),
            spec('Waga', '26 kg'),
          ],
        },
      ],
    },
    siblings: [
      {
        id: 'za-ho-b-family',
        label: 'ZA-HO3000-B / ZA-HO4500-B',
        family: 'Kompaktowa stacja high-output',
        image: image('za-ho3000-b-4500-b.png'),
        imageAlt: 'Modele ZA-HO3000-B i ZA-HO4500-B',
        lead: 'Warianty serii B wnoszą do linii ZA bardziej zwarte proporcje i bardzo nowoczesny charakter bryły.',
        summary:
          'Rodzina ZA-HO3000-B / ZA-HO4500-B to propozycja dla klientów, którzy potrzebują urządzenia z mocną rezerwą wydajności, ale cenią bardziej zwartą, współczesną architekturę korpusu.',
        story:
          'To bardzo atrakcyjna linia dla przestrzeni premium: daje wrażenie technologii nowoczesnej, niemal galeryjnej, a jednocześnie pozostaje pełnoprawną stacją do intensywnej pracy.',
        quickFacts: [
          'H2 + O2 compact high-output',
          '2000 / 1000 do 3000 / 1500 ml/min',
          '30 × 31 × 59 cm',
          'od 14 990,00 PLN brutto',
        ],
        benefits: [
          'Bardziej zwarta bryła przy zachowaniu bardzo mocnych parametrów pracy.',
          'Świetna prezentacja wizualna w nowoczesnych przestrzeniach premium.',
          'Rodzina, która dobrze łączy język designu z wysoką skalą techniczną.',
        ],
        highlights: [
          'nowoczesna, kompaktowa stacja high-output',
          'bardzo mocna rodzina dla wnętrz premium',
          'wyższa wydajność bez przejścia do największej bryły katalogu',
        ],
        variants: [
          {
            id: 'za-ho3000-b',
            model: 'ZA-HO3000-B',
            lead: 'Kompaktowa stacja dla miejsc, które chcą mówić o technologii językiem nowoczesnego designu.',
            description:
              'ZA-HO3000-B daje wysoką wydajność w bardziej zwartej, wizualnie nowoczesnej obudowie, dzięki czemu bardzo dobrze odnajduje się w estetycznie dopracowanych przestrzeniach premium.',
            story:
              'To sprzęt dla wnętrz, w których urządzenie ma być nie tylko wydajne, ale też dobrze wpisane w cały projekt doświadczenia klienta.',
            shortFlow: 'H2 2000 ml/min · O2 1000 ml/min',
            dimensions: '30 × 31 × 59 cm',
            weight: '26 kg',
            pricing: price(14990, 12186.99),
            benefits: [
              'Zwarta bryła dla nowoczesnych przestrzeni premium.',
              'Bardzo dobra relacja gabarytu do skali wydajności.',
              'Silny argument tam, gdzie design urządzenia jest równie ważny jak jego możliwości.',
            ],
            differentiators: [
              'Nowoczesna platforma z serii B.',
              'Wysoka wydajność w bardziej zwartej obudowie.',
              'Forma szczególnie atrakcyjna dla gabinetów premium i showroomów.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '2000 ml/min'),
              spec('O2', '1000 ml/min'),
              spec('Format', 'compact high-output'),
              spec('Wymiary', '30 × 31 × 59 cm'),
              spec('Waga', '26 kg'),
            ],
          },
          {
            id: 'za-ho4500-b',
            model: 'ZA-HO4500-B',
            lead: 'Mocniejsza odsłona tej samej nowoczesnej architektury.',
            description:
              'ZA-HO4500-B rozwija rodzinę B w stronę wyraźnie większej skali, zachowując ten sam współczesny, elegancki język projektowy.',
            story:
              'To model dla miejsc, które chcą mieć urządzenie mówiące jednocześnie o designie, intensywności i świadomie dobranej klasie technologii.',
            shortFlow: 'H2 3000 ml/min · O2 1500 ml/min',
            dimensions: '30 × 31 × 59 cm',
            weight: '27 kg',
            pricing: price(19490, 15845.53),
            benefits: [
              'Wyższa intensywność bez zmiany gabarytowego DNA rodziny B.',
              'Bardzo mocna propozycja dla zaawansowanych wdrożeń stacjonarnych.',
              'Flagowy design w kompaktowo-nowoczesnym wydaniu.',
            ],
            differentiators: [
              'Mocniejsza odsłona rodziny B.',
              'Ta sama bryła, wyższa rezerwa pracy.',
              'Model dla klientów szukających high-output z wyjątkowo nowoczesnym wyglądem.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '3000 ml/min'),
              spec('O2', '1500 ml/min'),
              spec('Format', 'compact high-output'),
              spec('Wymiary', '30 × 31 × 59 cm'),
              spec('Waga', '27 kg'),
            ],
          },
        ],
      },
      {
        id: 'za-ho6000-family',
        label: 'ZA-HO6000',
        family: 'Flagowa stacja całodziennego obciążenia',
        image: image('za-ho6000.png'),
        imageAlt: 'Model ZA-HO6000',
        lead: 'Najmocniejsza obecność całego katalogu: sprzęt, który komunikuje skalę, stabilność i gotowość do pracy bez kompromisów.',
        summary:
          'ZA-HO6000 jest flagową stacją portfolio Omega-3 2026. To model dla miejsc, które chcą sięgnąć po najwyższą klasę wydajności w całym katalogu i potrzebują urządzenia wyglądającego jak centralny punkt swojej strefy regeneracyjnej.',
        story:
          'To nie jest już tylko większe urządzenie. To stacja, która definiuje całą przestrzeń wokół siebie i naturalnie staje się najbardziej prestiżowym elementem oferty dla klienta oczekującego maksimum skali.',
        quickFacts: ['H2 4000 ml/min', 'O2 2000 ml/min', '33 × 36 × 63 cm', '31 990,00 PLN brutto'],
        benefits: [
          'Najwyższa skala wydajności w całej edycji Omega-3 2026.',
          'Naturalny wybór do przestrzeni premium pracujących w trybie intensywnym lub pokazowym.',
          'Mocny model wizerunkowy dla oferty, która chce komunikować top-of-the-line.',
        ],
        highlights: [
          'flagship high-output',
          'największa wydajność w katalogu',
          'stacja do najbardziej wymagających wdrożeń',
        ],
        variants: [
          {
            id: 'za-ho6000',
            model: 'ZA-HO6000',
            lead: 'Flagowy model dla najbardziej ambitnych środowisk pracy z wodorem.',
            description:
              'ZA-HO6000 zamyka linię zaawansowaną z pełnym poczuciem skali premium: to urządzenie dla miejsc, które potrzebują najwyższej wydajności i chcą ją pokazać w sposób absolutnie czytelny.',
            story:
              'W praktyce jest to model, który często pełni rolę wizytówki technologicznej całej przestrzeni. Ma pracować mocno, wyglądać poważnie i zostawiać wrażenie świadomie dobranej klasy najwyższej.',
            shortFlow: 'H2 4000 ml/min · O2 2000 ml/min',
            dimensions: '33 × 36 × 63 cm',
            weight: '27 kg',
            pricing: price(31990, 26008.13),
            benefits: [
              'Największa rezerwa wydajności w portfolio 2026.',
              'Model o najwyższej sile prezentacyjnej i handlowej.',
              'Stacja do wdrożeń, które nie chcą schodzić z poziomu top-tier.',
            ],
            differentiators: [
              'Topowa platforma całej edycji Omega-3 2026.',
              'Najwyższy łączny przepływ gazu w katalogu.',
              'Urządzenie budujące prestiż oferty i przestrzeni.',
            ],
            specs: [
              spec('Gaz', 'wodór + tlen'),
              spec('H2', '4000 ml/min'),
              spec('O2', '2000 ml/min'),
              spec('Platforma mocy', '1000 W'),
              spec('Wymiary', '33 × 36 × 63 cm'),
              spec('Waga', '27 kg'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'linia-wodorowa',
    kicker: '04 · Linia wodorowa',
    title: 'Linia Wodorowa',
    summary:
      'Linia wodorowa porządkuje urządzenia AQ wokół kąpieli, prysznica, punktu poboru i mobilnej butelki. To świat, w którym technologia wodoru wychodzi poza samą inhalację i staje się częścią codziennej architektury wellness w domu, apartamencie, strefie SPA lub przestrzeni pokazowej.',
    rangeLabel: '1300–4500 ppb · kąpiel, prysznic, dystrybutor i butelka AQ',
    featured: {
      id: 'aq-b-family',
      label: 'AQ-B300 / AQ-B600',
      family: 'Generatory do kąpieli wodorowej',
      image: image('aq-b300-b600.png'),
      imageAlt: 'Modele AQ-B300 i AQ-B600',
      lead: 'Kąpiel wodorowa w odsłonie premium: stacja, która zamienia łazienkę w prywatny rytuał regeneracyjny.',
      summary:
        'Rodzina AQ-B300 / AQ-B600 została pomyślana dla klientów, którzy chcą pracować z wodorem w kąpieli i potrzebują urządzenia bardziej stacjonarnego, bardziej zdecydowanego i bardziej premium niż mobilne rozwiązania uzupełniające.',
      story:
        'To produkty o bardzo silnym charakterze lifestyle-owym. Łączą wysoką koncentrację wodoru z poczuciem wejścia w pełnoprawny, domowy lub apartamentowy rytuał SPA.',
      quickFacts: ['2000 lub 3800 ppb', '1–10 l/min', '35 × 30 × 45 cm', 'od 8 990,00 PLN brutto'],
      benefits: [
        'Dwa poziomy stężenia pozwalają dobrać klasę urządzenia do rytuału kąpielowego i budżetu projektu.',
        'Wysoka estetyka korpusu dla domowych łazienek premium, apartamentów wellness i stref SPA.',
        'Rodzina AQ-B daje klientowi poczucie wejścia w kategorię wodoru w najbardziej zmysłowym, rytualnym wydaniu.',
      ],
      highlights: [
        'seria AQ do kąpieli wodorowej',
        'monitoring przepływu i jakości wody',
        'stacjonarny charakter dla prywatnego SPA',
      ],
      variants: [
        {
          id: 'aq-b300',
          model: 'AQ-B300',
          lead: 'Pierwszy próg wejścia do prywatnej kąpieli wodorowej w domu premium.',
          description:
            'AQ-B300 to model dla klienta, który chce włączyć wodór do przestrzeni kąpielowej w sposób uporządkowany, elegancki i technicznie czytelny.',
          story:
            'W praktyce jest to rozwiązanie dla osób, które szukają nie gadżetu, lecz sprzętu budującego prawdziwy rytuał domowego SPA.',
          shortFlow: '2000 ppb · wydajność wody 1–10 l/min',
          dimensions: '35 × 30 × 45 cm',
          weight: '21 kg',
          pricing: price(8990, 7308.94),
          benefits: [
            'Stacjonarna platforma do prywatnej kąpieli wodorowej.',
            'Elegancki sposób na wejście w linię AQ bez nadmiernej skali inwestycji.',
            'Dobry balans między luksusem doświadczenia a rozsądnym progiem cenowym.',
          ],
          differentiators: [
            'Rodzina kąpielowa AQ w wariancie 2000 ppb.',
            'Stała architektura do domowego lub apartamentowego SPA.',
            'Wyjście poza inhalację w stronę pełniejszego doświadczenia wellness.',
          ],
          specs: [
            spec('Stężenie H2', '2000 ppb'),
            spec('Wydajność wody', '1–10 l/min'),
            spec('Moc', '300 W'),
            spec('Monitoring', 'przepływ i jakość wody'),
            spec('Wymiary', '35 × 30 × 45 cm'),
            spec('Waga', '21 kg'),
          ],
        },
        {
          id: 'aq-b600',
          model: 'AQ-B600',
          lead: 'Mocniejsza odsłona kąpieli wodorowej dla klientów oczekujących bardziej wyrazistego premium experience.',
          description:
            'AQ-B600 rozwija tę samą elegancką platformę w stronę wyższego stężenia, budując mocniejsze doświadczenie dla prywatnych stref kąpielowych i projektów premium.',
          story:
            'To model dla osób, które chcą potraktować wodór w kąpieli jako element luksusowej, codziennej architektury regeneracji, a nie jedynie dodatek.',
          shortFlow: '3800 ppb · wydajność wody 1–10 l/min',
          dimensions: '35 × 30 × 45 cm',
          weight: '21 kg',
          pricing: price(10990, 8934.96),
          benefits: [
            'Wyższe stężenie dla bardziej premium pozycjonowania linii kąpielowej.',
            'Silniejsza propozycja do apartamentów wellness i stref SPA.',
            'Ten sam elegancki korpus, bogatszy profil urządzenia.',
          ],
          differentiators: [
            'Topowy wariant kąpielowej rodziny AQ-B.',
            '3800 ppb w stacjonarnym formacie premium.',
            'Urządzenie dla bardziej wymagających realizacji łazienkowych.',
          ],
          specs: [
            spec('Stężenie H2', '3800 ppb'),
            spec('Wydajność wody', '1–10 l/min'),
            spec('Moc', '600 W'),
            spec('Monitoring', 'przepływ i jakość wody'),
            spec('Wymiary', '35 × 30 × 45 cm'),
            spec('Waga', '21 kg'),
          ],
        },
      ],
    },
    siblings: [
      {
        id: 'aq-s-family',
        label: 'AQ-S1300 / AQ-S2000',
        family: 'Moduły prysznicowe AQ',
        image: image('aq-s1300-s2000.png'),
        imageAlt: 'Modele AQ-S1300 i AQ-S2000',
        lead: 'Prysznic wodorowy bez budowania całej wanny wokół urządzenia.',
        summary:
          'Rodzina AQ-S została przygotowana dla klientów, którzy chcą pracować z wodorem pod prysznicem i szukają rozwiązania bardziej zintegrowanego z codzienną architekturą łazienki.',
        story:
          'To bardzo nowoczesna odsłona linii AQ: bardziej dyskretna, ścienna, projektowa. Dobrze wpisuje się w dom premium, butikowe SPA i apartamentowe strefy regeneracyjne.',
        quickFacts: [
          '1300 lub 2000 ppb',
          'moduł do prysznica',
          '41 × 30 × 15 cm',
          'od 7 490,00 PLN brutto',
        ],
        benefits: [
          'Dwie odsłony pozwalają dobrać intensywność bez zmiany koncepcji montażu.',
          'Ścienny, zintegrowany charakter świetnie pracuje w nowoczesnych łazienkach premium.',
          'Linia AQ-S pokazuje, że wodór może wejść do codzienności w bardzo architektoniczny sposób.',
        ],
        highlights: [
          'prysznicowa rodzina ścienna AQ',
          'smukła forma do nowoczesnych projektów',
          'hydrogen wellness bez napełniania wanny',
        ],
        variants: [
          {
            id: 'aq-s1300',
            model: 'AQ-S1300',
            lead: 'Wejściowy moduł prysznicowy dla domu i łazienki projektowanej z myślą o wellbeing.',
            description:
              'AQ-S1300 daje klientowi komfort wejścia w prysznicową linię AQ w formacie lekkim, nowoczesnym i bardzo łatwym do wpisania w codzienną architekturę domu premium.',
            story:
              'To model dla osób, które chcą połączyć wodór z rytmem porannego lub wieczornego prysznica bez zajmowania dużej powierzchni użytkowej.',
            shortFlow: '1300 ppb',
            dimensions: '41 × 30 × 15 cm',
            weight: '7 kg',
            pricing: price(7490, 6089.43),
            benefits: [
              'Bardzo elegancki próg wejścia do rodziny prysznicowej AQ.',
              'Dyskretny, ścienny charakter dla nowoczesnych projektów łazienkowych.',
              'Świetna opcja dla klienta, który chce wejść w linię AQ stopniowo.',
            ],
            differentiators: [
              'Moduł ścienny do prysznica.',
              'Smukły format do wnętrz premium.',
              'Dobrze sprawdza się w codziennym rytuale bez budowy stacji kąpielowej.',
            ],
            specs: [
              spec('Stężenie H2', '1300 ppb'),
              spec('Moc', '190 W'),
              spec('Zasilanie', '100–240 V'),
              spec('Montaż', 'ścienny / prysznicowy'),
              spec('Wymiary', '41 × 30 × 15 cm'),
              spec('Waga', '7 kg'),
            ],
          },
          {
            id: 'aq-s2000',
            model: 'AQ-S2000',
            lead: 'Mocniejszy wariant dla projektu, który chce od razu wejść w wyższy standard prysznicowej linii AQ.',
            description:
              'AQ-S2000 zachowuje tę samą nowoczesną formę modułu ściennego, ale podnosi klasę stężenia i w naturalny sposób przesuwa urządzenie wyżej w hierarchii domowego wellbeing.',
            story:
              'To wybór dla inwestorów i klientów premium, którzy chcą, aby linia prysznicowa była nie tylko dodatkiem, ale pełnoprawnym elementem codziennego rytuału regeneracyjnego.',
            shortFlow: '2000 ppb',
            dimensions: '41 × 30 × 15 cm',
            weight: '7 kg',
            pricing: price(8990, 7308.94),
            benefits: [
              'Wyższe stężenie przy tej samej lekkiej bryle.',
              'Bardzo dobra opcja dla apartamentów wellness i nowoczesnych łazienek premium.',
              'Silniejsza propozycja dla klienta, który myśli o codziennym prysznicu wodorowym na serio.',
            ],
            differentiators: [
              'Topowy wariant ściennej rodziny AQ-S.',
              'Ta sama forma montażu, wyższe stężenie H2.',
              'Bardzo spójny wybór dla projektów premium.',
            ],
            specs: [
              spec('Stężenie H2', '2000 ppb'),
              spec('Moc', '260 W'),
              spec('Zasilanie', '100–240 V'),
              spec('Montaż', 'ścienny / prysznicowy'),
              spec('Wymiary', '41 × 30 × 15 cm'),
              spec('Waga', '7 kg'),
            ],
          },
        ],
      },
      {
        id: 'aq-pw3000-family',
        label: 'AQ-PW3000',
        family: 'Stacjonarny podajnik wody wodorowanej',
        image: image('aq-pw3000.png'),
        imageAlt: 'Model AQ-PW3000',
        lead: 'Wodór podawany w najbardziej praktycznym, codziennym formacie punktu poboru.',
        summary:
          'AQ-PW3000 został zaprojektowany dla przestrzeni, w których woda wodorowana ma być dostępna w sposób stały, uporządkowany i natychmiast wpisany w rytm dnia.',
        story:
          'To model idealny do kuchni premium, showroomu, recepcji strefy wellness lub prywatnej przestrzeni pracy. Zamiast jednorazowej sesji oferuje codzienny dostęp do wody wodorowanej w eleganckim, stacjonarnym formacie.',
        quickFacts: ['3000 ppb', '53 × 28 × 47 cm', '14 kg', '2 990,00 PLN brutto'],
        benefits: [
          'Stały punkt poboru wody wodorowanej dla codziennego użytkowania.',
          'Naturalne uzupełnienie strefy wellness, kuchni premium lub showroomu.',
          'Urządzenie, które rozszerza linię AQ w stronę praktycznego, codziennego komfortu.',
        ],
        highlights: [
          'stacjonarny dispenser AQ',
          'codzienny dostęp do wody wodorowanej',
          'elegancki format do wnętrz premium',
        ],
        variants: [
          {
            id: 'aq-pw3000',
            model: 'AQ-PW3000',
            lead: 'Codzienna woda wodorowana bez rytuału napełniania i czekania na pojedynczą butelkę.',
            description:
              'AQ-PW3000 jest urządzeniem dla klientów, którzy chcą zbudować wokół wodoru codzienny nawyk użytkowania w formacie stałego punktu poboru.',
            story:
              'To model o bardzo nowoczesnym sensie obecności: mniej gadżet, bardziej infrastruktura subtelnego, prywatnego wellbeing w domu lub w przestrzeni premium.',
            shortFlow: '3000 ppb',
            dimensions: '53 × 28 × 47 cm',
            weight: '14 kg',
            pricing: price(2990, 2430.89),
            benefits: [
              'Najbardziej praktyczny sposób codziennej pracy z wodą wodorowaną w linii AQ.',
              'Świetne uzupełnienie kuchni premium, recepcji lub strefy pokazowej.',
              'Model, który zamienia wodór w wygodny element codziennego rytmu dnia.',
            ],
            differentiators: [
              'Stacjonarny punkt poboru wody wodorowanej.',
              'Wyraźnie praktyczny charakter użytkowy.',
              'Dobra propozycja do przestrzeni prywatnych i komercyjnych premium.',
            ],
            specs: [
              spec('Stężenie H2', '3000 ppb'),
              spec('Format', 'stacjonarny podajnik wody'),
              spec('Przeznaczenie', 'kuchnia / showroom / wellness'),
              spec('Obsługa', 'ciągły punkt poboru'),
              spec('Wymiary', '53 × 28 × 47 cm'),
              spec('Waga', '14 kg'),
            ],
          },
        ],
      },
      {
        id: 'aq-b4500-family',
        label: 'AQ-B4500',
        family: 'Mobilna butelka AQ',
        image: image('aq-b4500.png'),
        imageAlt: 'Model AQ-B4500',
        lead: 'Najbardziej mobilna forma linii AQ: wodór, który można zabrać ze sobą bez utraty wrażenia premium.',
        summary:
          'AQ-B4500 zamyka linię wodorową z lekkim, mobilnym akcentem. To rozwiązanie dla klientów, którzy chcą mieć wodór przy sobie w podróży, w pracy, na spotkaniach i w codziennym rytmie poza domem.',
        story:
          'W świecie dużych stacji i modułów AQ-B4500 działa jak biżuteria technologiczna: mała, smukła, gotowa do użycia tam, gdzie tradycyjny sprzęt stacjonarny nie ma sensu.',
        quickFacts: ['4000–4500 ppb', '390 ml', 'cykl 5 / 10 min', '500,00 PLN brutto'],
        benefits: [
          'Mobilny dostęp do wody wodorowanej poza domem i poza stałą instalacją.',
          'Smukła, estetyczna forma dobrze wpisująca się w premium lifestyle.',
          'Naturalny model uzupełniający dla klientów posiadających większą infrastrukturę AQ w domu.',
        ],
        highlights: [
          'najbardziej mobilny model całej linii AQ',
          'wysokie stężenie w lekkim formacie',
          'butelka do domu, pracy i podróży',
        ],
        variants: [
          {
            id: 'aq-b4500',
            model: 'AQ-B4500',
            lead: 'Woda wodorowana w najbardziej osobistej, natychmiastowej formie.',
            description:
              'AQ-B4500 pozwala utrzymać kontakt z linią AQ także poza przestrzenią domową czy gabinetową, oferując mobilność bez utraty poczucia obcowania z produktem premium.',
            story:
              'To urządzenie dla klientów, którzy chcą, aby wodór był z nimi nie tylko w rytuale stacjonarnym, ale także w ruchu, w podróży i w pracy.',
            shortFlow: '4000–4500 ppb',
            dimensions: '17 × 22 cm',
            weight: '2 kg',
            pricing: price(500, 406.5),
            benefits: [
              'Mobilność bez rezygnacji z wysokiego stężenia H2.',
              'Bardzo elegancki dodatek do codziennego stylu życia premium.',
              'Świetny model uzupełniający dla użytkownika większych systemów AQ.',
            ],
            differentiators: [
              'Butelka z technologią SPE / PEM.',
              'Cykl pracy 5 / 10 minut.',
              'Smukła forma do codziennego noszenia i podróży.',
            ],
            specs: [
              spec('Stężenie H2', '4000–4500 ppb'),
              spec('Pojemność', '390 ml'),
              spec('Cykl', '5 / 10 min'),
              spec('Komora', 'SPE / PEM'),
              spec('Wymiary', '17 × 22 cm'),
              spec('Waga', '2 kg'),
            ],
          },
        ],
      },
    ],
  },
];
export const omega3CatalogRows: Omega3CatalogRow[] = omega3CatalogSections.flatMap((section) =>
  [section.featured, ...section.siblings].flatMap((tile) =>
    tile.variants.map((variant) => ({
      id: variant.id,
      model: variant.model,
      line: section.title,
      family: tile.family,
      summary: variant.description,
      image: tile.image,
      grossPrice: variant.pricing.grossPrice,
      netPrice: variant.pricing.netPrice,
      briefSpec: `${variant.shortFlow} · ${variant.dimensions} · ${variant.weight}`,
    })),
  ),
);
