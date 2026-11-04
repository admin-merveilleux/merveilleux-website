import { getPayload } from 'payload'
import config from '../payload.config'

const ctasToSeed = [
  // TOFU
  {
    internalName: 'TOFU - Suivre merveilleUX sur LinkedIn',
    funnel: 'tofu' as const,
    isActive: true,
    buttonUrl: 'https://www.linkedin.com/company/merveilleux-design/',
    fr: {
      title: 'Votre logiciel mérite mieux que des conseils UX génériques.',
      subtitle: 'Suivez nos analyses produit sur LinkedIn.',
      text: 'On y parle de SaaS B2B, d’interfaces complexes, de dette UX, d’adoption et de modernisation produit. Pas de tendances creuses : des réflexions concrètes pour les équipes qui construisent des logiciels métiers.',
      buttonText: 'Suivre merveilleUX',
      badge: 'Conseils & Tendances',
    },
    en: {
      title: 'News, Best Practices, UI/UX Design Trends',
      subtitle: "Don't miss out, follow merveilleUX",
      text: 'Follow us now on LinkedIn to stay updated on the latest trends, tips, and analyses. Join our community and be part of the conversation!',
      buttonText: 'Follow us on LinkedIn',
      badge: 'Insights & Trends',
    },
  },
  {
    internalName: "TOFU - Découvrir l'approche merveilleUX",
    funnel: 'tofu' as const,
    isActive: true,
    buttonUrl: '/fr/agence',
    fr: {
      title: 'Comment modernise-t-on un produit sans tout reconstruire ?',
      subtitle: 'Découvrez notre approche produit.',
      text: 'Chez merveilleUX, on aide les éditeurs de logiciels à clarifier leurs parcours, rendre leurs interfaces plus crédibles et mieux aligner produit, design et tech. Découvrez notre manière de travailler.',
      buttonText: 'Découvrir notre approche',
      badge: 'Méthodologie',
    },
    en: {
      title: 'How do you modernize a product without rebuilding everything?',
      subtitle: 'Discover our product design approach.',
      text: 'At merveilleUX, we help software publishers clarify user journeys, make interfaces more credible, and align product, design, and tech. Discover how we work.',
      buttonText: 'Discover our approach',
      badge: 'Methodology',
    },
  },
  {
    internalName: 'TOFU - Newsletter UX Wonders',
    funnel: 'tofu' as const,
    isActive: true,
    buttonUrl: 'https://www.merveilleux.design/outils/newsletter/',
    fr: {
      title: 'La newsletter pour celles et ceux qui construisent des SaaS B2B.',
      subtitle: 'Recevez UX Wonders, une dose mensuelle de stratégie produit.',
      text: 'Une fois par mois, on partage des analyses concrètes sur l’UX des logiciels : adoption, onboarding, dette d’interface, modernisation, design produit et collaboration avec les équipes tech.',
      buttonText: 'Recevoir la prochaine édition',
      badge: 'Newsletter',
    },
    en: {
      title: "Don't miss our upcoming specialized UX articles",
      subtitle: 'Activate merveilleUX notifications on LinkedIn',
      text: 'Be among the first to receive our latest articles, analyses, and tips. Stay always connected with the latest UX trends for SaaS!',
      buttonText: 'Go to LinkedIn',
      badge: 'Newsletter',
    },
  },

  // MOFU
  {
    internalName: 'MOFU - Audit UX SaaS',
    funnel: 'mofu' as const,
    isActive: true,
    buttonUrl: '/fr/services/audit-ux',
    fr: {
      title: 'Votre produit n’a peut-être pas besoin de plus de features.',
      subtitle: 'Il a peut-être besoin d’un audit UX.',
      text: 'On analyse vos parcours clés pour identifier les frictions qui freinent l’adoption, compliquent l’onboarding ou génèrent des tickets support. Vous repartez avec des constats clairs et des priorités d’amélioration concrètes.',
      buttonText: 'Voir notre audit UX',
      badge: 'Audit UX',
    },
    en: {
      title: 'Get an UX Audit for Your Solution',
      subtitle: 'Increase conversion rate, Decrease churn rate.',
      text: "Whether you're a growing startup or an industry giant, maximize the usability and performance of your solution with our UX Audit service.",
      buttonText: 'Explore UX Audit',
      badge: 'UX Audit',
    },
  },
  {
    internalName: "MOFU - Modernisation d'interface & Maquettes",
    funnel: 'mofu' as const,
    isActive: true,
    buttonUrl: '/fr/services/maquettes',
    fr: {
      title: 'Votre interface fait le job, mais ne rassure plus assez ?',
      subtitle: 'Modernisez les écrans qui comptent vraiment.',
      text: 'Nous modernisons les interfaces de logiciels B2B devenus complexes, datés ou difficiles à vendre en démo. Objectif : plus de clarté, plus de crédibilité produit, et une expérience plus simple à faire adopter.',
      buttonText: 'Découvrir la modernisation d’interface',
      badge: 'UI & Maquettes',
    },
    en: {
      title: 'Bring Your Product Ideas to Life with Prototypes',
      subtitle: 'Custom mockups, reducing friction',
      text: 'Discover how our mockup and prototype services can bring your ideas to life! Explore our full range of design solutions and let our experts create custom mockups for your business.',
      buttonText: 'Explore Mockup Service',
      badge: 'UI & Mockups',
    },
  },
  {
    internalName: 'MOFU - Partenaires Produit (Abonnement)',
    funnel: 'mofu' as const,
    isActive: true,
    buttonUrl: '/fr/services/partenaires',
    fr: {
      title: 'Votre roadmap avance plus vite que votre capacité design ?',
      subtitle: 'Ajoutez un partenaire produit à votre équipe.',
      text: 'Avec Partenaires Produit, vous avancez en continu sur vos priorités : parcours critiques, nouvelles fonctionnalités, amélioration d’écrans, cohérence d’interface, documentation et passation dev. Sans recruter trop tôt en interne.',
      buttonText: 'Découvrir Partenaires Produit',
      badge: 'Partenaires Produit',
    },
    en: {
      title: 'Is your roadmap moving faster than your design capacity?',
      subtitle: 'Add a dedicated product design partner to your team.',
      text: 'With Product Partners, move forward continuously on critical user journeys, new features, and design documentation without the overhead of hiring internally too early.',
      buttonText: 'Discover Product Partners',
      badge: 'Product Partners',
    },
  },

  // BOFU
  {
    internalName: 'BOFU - Session découverte 30 min',
    funnel: 'bofu' as const,
    isActive: true,
    buttonUrl: 'https://engage.merveilleux.design/meetings/clebehot',
    fr: {
      title: 'Votre produit a grandi plus vite que son expérience utilisateur ?',
      subtitle: 'Remettez de la clarté dans vos parcours critiques.',
      text: 'On analyse votre SaaS B2B pour identifier les frictions qui freinent l’adoption, compliquent les démos ou ralentissent vos équipes produit et tech.',
      buttonText: 'Planifier une session de 30 min',
      badge: 'Consultation Offerte',
    },
    en: {
      title: 'Ready to boost the user experience of your SaaS?',
      subtitle: 'Schedule a free consultation with one of our UX experts',
      text: "Let's discuss your specific needs and discover how we can help you optimize your product!",
      buttonText: 'Schedule 30-min Call',
      badge: 'Free Consultation',
    },
  },
  {
    internalName: 'BOFU - Priorités Produit & Modernisation',
    funnel: 'bofu' as const,
    isActive: true,
    buttonUrl: 'https://engage.merveilleux.design/meetings/clebehot',
    fr: {
      title: 'Votre logiciel devient difficile à utiliser, à vendre ou à faire évoluer ?',
      subtitle: 'Modernisez sans repartir de zéro.',
      text: 'Nous vous aidons à prioriser les améliorations UX qui auront le plus d’impact sur la clarté, l’adoption et la crédibilité de votre produit.',
      buttonText: 'Identifier mes priorités produit',
      badge: 'Stratégie Produit',
    },
    en: {
      title: 'Our team can help you achieve your UX goals',
      subtitle: 'Request a quote for our UX services now',
      text: 'Ready to improve the user experience of your SaaS? Request a personalized quote now to discover how our team can help you achieve your UX goals!',
      buttonText: 'Contact Us',
      badge: 'Product Strategy',
    },
  },
  {
    internalName: 'BOFU - Analyse Dette UX & Tech',
    funnel: 'bofu' as const,
    isActive: true,
    buttonUrl: 'https://engage.merveilleux.design/meetings/clebehot',
    fr: {
      title: 'Et si votre dette UX ralentissait aussi votre équipe tech ?',
      subtitle: 'Moins de complexité. Plus de cohérence produit.',
      text: 'Une interface accumulée par couches finit par coûter cher : tickets support, arbitrages flous, composants instables, sprints ralentis. On vous aide à remettre un cadre clair.',
      buttonText: 'Analyser ma dette UX',
      badge: 'Dette UX',
    },
    en: {
      title: 'What if UX debt is slowing down your tech team?',
      subtitle: 'Less complexity. Greater product consistency.',
      text: 'Layered interface debt costs time: support tickets, ambiguous UI tradeoffs, slowed sprints. We help you establish a rock-solid, streamlined design framework.',
      buttonText: 'Analyze UX Debt',
      badge: 'UX Debt',
    },
  },
  {
    internalName: 'BOFU - Crédibilité Démo & Devis Audit',
    funnel: 'bofu' as const,
    isActive: true,
    buttonUrl: 'https://engage.merveilleux.design/meetings/clebehot',
    fr: {
      title: 'Votre SaaS fait le job, mais ne rassure plus assez ?',
      subtitle: 'Rendez votre produit plus crédible en démo.',
      text: 'On identifie les zones de friction, d’incohérence ou de complexité qui affaiblissent la perception de votre produit auprès des prospects, clients et équipes internes.',
      buttonText: 'Demander un devis pour un Audit UX',
      badge: 'Audit & Démo',
    },
    en: {
      title: 'Our launch prices are attractive',
      subtitle: 'A full-stack designer for only €450/day',
      text: 'Do you need UX services? A SaaS UX Audit, Product Mockups/Prototypes, a Design System, or Gamification? Our offers adapt to the needs and budget of your company.',
      buttonText: 'Learn more',
      badge: 'Audit & Pricing',
    },
  },
]

async function run() {
  console.log('Connecting to Payload...')
  const payload = await getPayload({ config })
  console.log('Payload connected. Seeding CTAs...')

  for (const item of ctasToSeed) {
    const existing = await payload.find({
      collection: 'article-ctas',
      where: {
        internalName: { equals: item.internalName },
      },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      console.log(`- Updating existing CTA: ${item.internalName} (ID: ${existing.docs[0].id})`)
      const docId = existing.docs[0].id

      // Update FR
      await payload.update({
        collection: 'article-ctas',
        id: docId,
        locale: 'fr',
        overrideAccess: true,
        data: {
          funnel: item.funnel,
          isActive: item.isActive,
          buttonUrl: item.buttonUrl,
          title: item.fr.title,
          subtitle: item.fr.subtitle,
          text: item.fr.text,
          buttonText: item.fr.buttonText,
          badge: item.fr.badge,
        },
      })

      // Update EN
      await payload.update({
        collection: 'article-ctas',
        id: docId,
        locale: 'en',
        overrideAccess: true,
        data: {
          title: item.en.title,
          subtitle: item.en.subtitle,
          text: item.en.text,
          buttonText: item.en.buttonText,
          badge: item.en.badge,
        },
      })
    } else {
      console.log(`+ Creating new CTA: ${item.internalName}`)

      // Create FR
      const created = await payload.create({
        collection: 'article-ctas',
        locale: 'fr',
        overrideAccess: true,
        data: {
          internalName: item.internalName,
          funnel: item.funnel,
          isActive: item.isActive,
          buttonUrl: item.buttonUrl,
          title: item.fr.title,
          subtitle: item.fr.subtitle,
          text: item.fr.text,
          buttonText: item.fr.buttonText,
          badge: item.fr.badge,
        },
      })

      // Update EN
      await payload.update({
        collection: 'article-ctas',
        id: created.id,
        locale: 'en',
        overrideAccess: true,
        data: {
          title: item.en.title,
          subtitle: item.en.subtitle,
          text: item.en.text,
          buttonText: item.en.buttonText,
          badge: item.en.badge,
        },
      })
    }
  }

  const allCtas = await payload.find({
    collection: 'article-ctas',
    limit: 100,
    overrideAccess: true,
  })
  console.log(`\nSuccessfully seeded! Total ArticleCTAs in database: ${allCtas.totalDocs}`)
  process.exit(0)
}

run().catch(err => {
  console.error('Seeding error:', err)
  process.exit(1)
})
