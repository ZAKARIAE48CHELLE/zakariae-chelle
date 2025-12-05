// Translation data
const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      education: "Education",
      skills: "Skills",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      subtitle: "Full Stack Developer & Computer Science Graduate",
      description:
        "Specialized in Angular, TypeScript, and modern web technologies. Graduate in Computer Engineering from Université Abdelmalek Essaadi.",
      location: "Tanger, Morocco",
      viewWork: "View My Work",
      getInTouch: "Get In Touch",
    },
    about: {
      title: "About Me",
      subtitle: "Get to know me better",
      description1:
        "I'm a passionate Full Stack Developer with a strong academic background in Computer Science. I graduated with a Bachelor's degree in Computer Engineering (Génie Informatique) from Université Abdelmalek Essaadi in Tangier, Morocco.",
      description2:
        "My expertise lies in building scalable web applications using modern technologies like Angular, TypeScript, and Node.js. I have a particular passion for creating dynamic forms, diagnostic tools, and survey systems that provide excellent user experiences.",
      stats: {
        study: "Years of Study",
        projects: "Projects Completed",
        languages: "Languages Spoken",
      },
      strengths: {
        title: "Core Strengths",
        item1: "Component-driven architecture in Angular",
        item2: "Efficient form validation & dynamic input rendering",
        item3: "Clean code practices and strong debugging skills",
        item4: "Experience building reusable UI components",
        item5: "Focused on user experience and accessibility",
        item6: "Multilingual development (Arabic, French, English)",
      },
    },

    education: {
      title: "Education",
      subtitle: "My academic journey",

      emsi: {
        title: "Engineering Cycle – Computer Science",
        subtitle: "École Marocaine des Sciences de l'Ingénieur (EMSI) – Tangier",
        institution: "EMSI Tangier – Computer Science Track (4th Year)",
        duration: "2025 - Present",
        description:
          "Continuing engineering studies in advanced software development, information systems, and applied computer science.",
      },

      bachelor: {
        title: "Bachelor's Degree in Computer Engineering",
        subtitle: "Licence en Sciences et Techniques - Génie Informatique",
        institution:
          "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention: "Mention: Assez Bien (Good)",
        description:
          "Comprehensive program covering software engineering, algorithms, data structures, and modern web technologies.",
      },
      diploma: {
        title: "University Diploma in Science and Technology",
        subtitle: "Diplôme d'Études Universitaires en Sciences et Techniques",
        institution:
          "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention:
          "Filière: Mathématiques-Informatique-Physique | Mention: Passable",
      },
      bac: {
        title: "Baccalauréat in Physical Sciences",
        subtitle: "2ème Année BAC Sciences Physiques",
        institution: "Lycée Qualifiant Abdellah Chefchaouni, Tanger",
        mention: "Mention: Bien (Good)",
        description:
          "Specialized in Physical Sciences with strong foundation in Mathematics, Physics, and Chemistry.",
      },
    },

    skills: {
      title: "Technical Skills",
      subtitle: "Technologies I work with",
      frontend: { title: "Frontend Development" },
      backend: { title: "Backend Development" },
      tools: { title: "Tools & Technologies" },
      languages: {
        title: "Languages",
        arabic: "Arabic",
        french: "French",
        english: "English",
        native: "Native",
        fluent: "Fluent",
        intermediate: "Intermediate",
      },
    },

    projects: {
      title: "Projects & Experience",
      subtitle: "Some of my recent work",
      sav: {
        title: "SAV Management System",
        description:
          "Comprehensive ticketing and diagnostic system with structured nested characteristics and multilingual support using ngx-translate.",
        feature1: "Ticketing System",
        feature2: "Diagnostic Tools",
        feature3: "Multilingual Support",
      },
      survey: {
        title: "Dynamic Survey Builder",
        description:
          "Advanced survey system with reusable components for nested questions and dynamic form rendering using Angular FormArray.",
        feature1: "Nested Questions",
        feature2: "Group Logic",
        feature3: "Dynamic Rendering",
      },
      android: {
        title: "Android To-Do App",
        description:
          "Minimalist productivity application with task tracking and Firebase synchronization for seamless cross-device experience.",
        feature1: "Task Management",
        feature2: "Cloud Sync",
        feature3: "Offline Support",
      },
      product: {
        title: "Product Characteristics Module",
        description:
          "Hierarchical product management system with GroupeCaracteristique → CaracteristiqueDemandable → InstanceCaracteristique architecture.",
        feature1: "Hierarchical Model",
        feature2: "Diagnostic UI",
        feature3: "Product Management",
      },
      table: {
        title: "Dynamic Table Component",
        description:
          "Reusable Angular table component with advanced features including sorting, filtering, and responsive design.",
        feature1: "Dynamic Headers",
        feature2: "Sorting & Filtering",
        feature3: "Responsive Layout",
      },
      multilang: {
        title: "Multi-language System",
        description:
          "Comprehensive internationalization system supporting Arabic, French, and English with live language switching.",
        feature1: "Live Language Switch",
        feature2: "RTL Support",
        feature3: "Dynamic Updates",
      },
      marketplace: {
        title: "Full Marketplace Platform",
        description:
          "End-to-end marketplace solution including product listings, cart system, company/event presentations, and reservation management.",
        feature1: "Cart & Checkout Flow",
        feature2: "Reservation Integration",
        feature3: "Company & Event Pages",
      },
      filtering: {
        title: "Dynamic Filtering Engine",
        description:
          "Reusable and scalable filtering system for multi-criteria search across objects, surveys, and reservations.",
        feature1: "Multi-Criteria Filters",
        feature2: "Filter Chips & Reset",
        feature3: "Debounced Search",
      },
      relation: {
        title: "Relation-Based Data Binding",
        description:
          "Built structured UI logic to group and display data by contextual relations in dynamic forms and lists.",
        feature1: "Group-Based Sections",
        feature2: "Two-Way Form Binding",
        feature3: "Clean Component Structure",
      },
      devtools: {
        title: "Dev Tools & Automation",
        description:
          "Created CLI tools and shell scripts to streamline development tasks like killing processes and port management.",
        feature1: "Port Cleanup Scripts",
        feature2: "Process Monitoring",
        feature3: "Quick Environment Setup",
      },
      checklist: {
        title: "Checklist & Diagnostic Tool",
        description:
          "Built a dynamic checklist engine to assist testers in identifying issues during product evaluation and maintenance processes.",
        feature1: "Dynamic Checklists",
        feature2: "Real-time State Updates",
        feature3: "Support for Conditional Logic",
      },
      dashboard: {
        title: "Admin Dashboard Panels",
        description:
          "Developed reusable and toggleable admin panels for viewing, filtering, and managing backend data entities in a user-friendly interface.",
        feature1: "Collapsible Sections",
        feature2: "Filterable Data Tables",
        feature3: "Modular Panel Components",
      },
    },

    contact: {
      title: "Get In Touch",
      subtitle: "Let's work together",
      connect: "Let's Connect",
      description:
        "I'm always interested in new opportunities and exciting projects. Feel free to reach out if you'd like to work together!",
      email: "Email",
      phone: "Phone",
      location: "Location",
      locationValue: "Tanger, Morocco",
      form: {
        name: "Your Name",
        email: "Your Email",
        subject: "Subject",
        message: "Your Message",
        send: "Send Message",
      },
    },

    footer: {
      copyright: "© 2024 Zakariae Chelle. All rights reserved.",
      built: "Built with HTML, CSS, and JavaScript",
    },
  },

  /* ------------------------------------------------------
     ---------------------- FRENCH -------------------------
     ------------------------------------------------------ */

  fr: {
    nav: {
      home: "Accueil",
      about: "À propos",
      education: "Formation",
      skills: "Compétences",
      projects: "Projets",
      contact: "Contact",
    },
    hero: {
      subtitle: "Développeur Full Stack & Diplômé en Informatique",
      description:
        "Spécialisé en Angular, TypeScript et technologies web modernes. Diplômé en Génie Informatique de l'Université Abdelmalek Essaadi.",
      location: "Tanger, Maroc",
      viewWork: "Voir Mon Travail",
      getInTouch: "Me Contacter",
    },
    about: {
      title: "À Propos de Moi",
      subtitle: "Apprenez à me connaître",
      description1:
        "Je suis un développeur Full Stack passionné avec une solide formation académique en informatique. J'ai obtenu une licence en Génie Informatique de l'Université Abdelmalek Essaadi à Tanger.",
      description2:
        "Mon expertise réside dans la création d'applications web évolutives utilisant Angular, TypeScript et Node.js. J’apprécie concevoir des formulaires dynamiques et des outils de diagnostic offrant une excellente expérience utilisateur.",
      stats: {
        study: "Années d'Études",
        projects: "Projets Réalisés",
        languages: "Langues Parlées",
      },
      strengths: {
        title: "Forces Principales",
        item1: "Architecture basée sur les composants en Angular",
        item2: "Validation efficace des formulaires et rendu dynamique",
        item3: "Pratiques de code propre et débogage avancé",
        item4: "Création de composants UI réutilisables",
        item5: "Focus sur l’expérience utilisateur et l’accessibilité",
        item6: "Développement multilingue (Arabe, Français, Anglais)",
      },
    },

    education: {
      title: "Formation",
      subtitle: "Mon parcours académique",

      emsi: {
        title: "Cycle d'Ingénieur – Informatique",
        subtitle:
          "École Marocaine des Sciences de l'Ingénieur (EMSI) – Tanger",
        institution: "EMSI Tanger – Filière Informatique (4ème année)",
        duration: "2025 - Présent",
        description:
          "Poursuite des études d’ingénierie en développement logiciel avancé, systèmes d’information et informatique appliquée.",
      },

      bachelor: {
        title: "Licence en Génie Informatique",
        subtitle: "Licence en Sciences et Techniques - Génie Informatique",
        institution:
          "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention: "Mention: Assez Bien",
        description:
          "Programme complet couvrant le génie logiciel, les algorithmes, les structures de données et les technologies web modernes.",
      },
      diploma: {
        title: "Diplôme Universitaire en Sciences et Techniques",
        subtitle: "Diplôme d'Études Universitaires en Sciences et Techniques",
        institution:
          "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention:
          "Filière: Mathématiques-Informatique-Physique | Mention: Passable",
      },
      bac: {
        title: "Baccalauréat en Sciences Physiques",
        subtitle: "2ème Année BAC Sciences Physiques",
        institution: "Lycée Qualifiant Abdellah Chefchaouni, Tanger",
        mention: "Mention: Bien",
        description:
          "Spécialisé en Sciences Physiques avec une base solide en Mathématiques, Physique et Chimie.",
      },
    },

    skills: {
      title: "Compétences Techniques",
      subtitle: "Technologies avec lesquelles je travaille",
      frontend: { title: "Développement Frontend" },
      backend: { title: "Développement Backend" },
      tools: { title: "Outils & Technologies" },
      languages: {
        title: "Langues",
        arabic: "Arabe",
        french: "Français",
        english: "Anglais",
        native: "Natif",
        fluent: "Courant",
        intermediate: "Intermédiaire",
      },
    },

    projects: {
      title: "Projets & Expérience",
      subtitle: "Quelques-uns de mes travaux récents",
      sav: {
        title: "Système de Gestion SAV",
        description:
          "Système complet de billetterie et de diagnostic avec caractéristiques imbriquées et support multilingue.",
        feature1: "Système de Billetterie",
        feature2: "Outils de Diagnostic",
        feature3: "Support Multilingue",
      },
      survey: {
        title: "Constructeur d'Enquêtes Dynamiques",
        description:
          "Système d'enquête avec composants réutilisables et rendu dynamique via Angular FormArray.",
        feature1: "Questions Imbriquées",
        feature2: "Logique de Groupe",
        feature3: "Rendu Dynamique",
      },
      android: {
        title: "Application Android To-Do",
        description:
          "Application minimaliste de gestion des tâches avec synchronisation Firebase.",
        feature1: "Gestion des Tâches",
        feature2: "Synchronisation Cloud",
        feature3: "Mode Hors Ligne",
      },
      product: {
        title: "Module de Caractéristiques Produit",
        description:
          "Système hiérarchique de gestion de produits basé sur GroupeCaracteristique → CaracteristiqueDemandable → InstanceCaracteristique.",
        feature1: "Modèle Hiérarchique",
        feature2: "Interface de Diagnostic",
        feature3: "Gestion des Produits",
      },
      table: {
        title: "Composant de Tableau Dynamique",
        description:
          "Tableau Angular réutilisable avec tri, filtrage et design responsive.",
        feature1: "En-têtes Dynamiques",
        feature2: "Tri & Filtrage",
        feature3: "Mise en Page Responsive",
      },
      multilang: {
        title: "Système Multi-langues",
        description:
          "Support complet pour l'arabe, le français et l'anglais avec changement en direct.",
        feature1: "Changement Direct",
        feature2: "Support RTL",
        feature3: "Mises à Jour Dynamiques",
      },
      marketplace: {
        title: "Plateforme Marketplace Complète",
        description:
          "Solution intégrée incluant produits, panier, pages entreprise/événement et réservations.",
        feature1: "Panier & Paiement",
        feature2: "Gestion des Réservations",
        feature3: "Pages Événement & Entreprise",
      },
      filtering: {
        title: "Moteur de Filtrage Dynamique",
        description:
          "Système réutilisable pour la recherche multi-critères sur objets et réservations.",
        feature1: "Filtres Multi-Critères",
        feature2: "Puces & Réinitialisation",
        feature3: "Recherche Différée",
      },
      relation: {
        title: "Liaison Basée sur les Relations",
        description:
          "Logique UI structurée pour regrouper et afficher les données selon le contexte.",
        feature1: "Sections par Groupe",
        feature2: "Formulaire Bidirectionnel",
        feature3: "Structure Propre",
      },
      devtools: {
        title: "Outils & Automatisation",
        description:
          "Scripts CLI pour gérer les ports et accélérer le développement.",
        feature1: "Nettoyage des Ports",
        feature2: "Surveillance des Processus",
        feature3: "Setup Rapide",
      },
      checklist: {
        title: "Outil de Checklist & Diagnostic",
        description:
          "Moteur dynamique pour faciliter l'évaluation et la maintenance produit.",
        feature1: "Checklists Dynamiques",
        feature2: "Mises à Jour Temps Réel",
        feature3: "Logique Conditionnelle",
      },
      dashboard: {
        title: "Panneaux Admin",
        description:
          "Panneaux modulaires et filtrables pour la gestion backend.",
        feature1: "Sections Pliables",
        feature2: "Tables Filtrables",
        feature3: "Composants Modulaires",
      },
    },

    contact: {
      title: "Entrer en Contact",
      subtitle: "Travaillons ensemble",
      connect: "Connectons-nous",
      description:
        "Je suis toujours intéressé par de nouvelles opportunités. Contactez-moi si vous souhaitez collaborer !",
      email: "Email",
      phone: "Téléphone",
      location: "Localisation",
      locationValue: "Tanger, Maroc",
      form: {
        name: "Votre Nom",
        email: "Votre Email",
        subject: "Sujet",
        message: "Votre Message",
        send: "Envoyer le Message",
      },
    },

    footer: {
      copyright: "© 2024 Zakariae Chelle. Tous droits réservés.",
      built: "Construit avec HTML, CSS et JavaScript",
    },
  },

  /* ------------------------------------------------------
     ---------------------- ARABIC -------------------------
     ------------------------------------------------------ */

  ar: {
    nav: {
      home: "الرئيسية",
      about: "نبذة عني",
      education: "التعليم",
      skills: "المهارات",
      projects: "المشاريع",
      contact: "التواصل",
    },
    hero: {
      subtitle: "مطور ويب متكامل وخريج علوم الحاسوب",
      description:
        "متخصص في Angular وTypeScript وتقنيات الويب الحديثة. خريج هندسة الحاسوب من جامعة عبد المالك السعدي.",
      location: "طنجة، المغرب",
      viewWork: "عرض أعمالي",
      getInTouch: "تواصل معي",
    },
    about: {
      title: "نبذة عني",
      subtitle: "تعرف علي أكثر",
      description1:
        "أنا مطور ويب متكامل لدي شغف كبير وخلفية أكاديمية قوية في علوم الحاسوب. حصلت على إجازة في الهندسة المعلوماتية من جامعة عبد المالك السعدي.",
      description2:
        "تكمن خبرتي في تطوير تطبيقات الويب القابلة للتوسع باستخدام Angular وTypeScript وNode.js. أحب تصميم النماذج الديناميكية وأدوات التشخيص وأنظمة الاستطلاع.",
      stats: {
        study: "سنوات الدراسة",
        projects: "المشاريع المكتملة",
        languages: "اللغات",
      },
      strengths: {
        title: "نقاط القوة",
        item1: "تصميم معماري مبني على المكونات في Angular",
        item2: "تحقق فعال من النماذج مع عرض ديناميكي",
        item3: "كتابة كود نظيف ومهارات قوية في التصحيح",
        item4: "خبرة في إنشاء مكونات UI قابلة لإعادة الاستخدام",
        item5: "التركيز على تجربة المستخدم وسهولة الاستخدام",
        item6: "التطوير بلغات متعددة (العربية، الفرنسية، الإنجليزية)",
      },
    },

    education: {
      title: "التعليم",
      subtitle: "رحلتي الأكاديمية",

      emsi: {
        title: "سلك الهندسة – علوم الحاسوب",
        subtitle: "المدرسة المغربية لعلوم المهندس (EMSI) – طنجة",
        institution: "EMSI طنجة – شعبة الإعلاميات (السنة الرابعة)",
        duration: "2025 - إلى الآن",
        description:
          "مواصلة دراسة الهندسة في تطوير البرمجيات المتقدمة، وأنظمة المعلومات، وعلوم الحاسوب التطبيقية.",
      },

      bachelor: {
        title: "إجازة في الهندسة المعلوماتية",
        subtitle: "إجازة في العلوم والتقنيات - الهندسة المعلوماتية",
        institution: "جامعة عبد المالك السعدي، كلية العلوم والتقنيات، طنجة",
        mention: "الميزة: مستحسن",
        description:
          "برنامج شامل يغطي هندسة البرمجيات والخوارزميات وهياكل البيانات وتقنيات الويب الحديثة.",
      },
      diploma: {
        title: "دبلوم جامعي في العلوم والتقنيات",
        subtitle: "دبلوم الدراسات الجامعية في العلوم والتقنيات",
        institution: "جامعة عبد المالك السعدي، كلية العلوم والتقنيات، طنجة",
        mention: "المسلك: الرياضيات-الإعلاميات-الفيزياء | الميزة: مقبول",
      },
      bac: {
        title: "باكالوريا في العلوم الفيزيائية",
        subtitle: "السنة الثانية باكالوريا علوم فيزيائية",
        institution: "الثانوية التأهيلية عبد الله الشفشاوني، طنجة",
        mention: "الميزة: حسن",
        description:
          "تخصص في العلوم الفيزيائية مع أساس قوي في الرياضيات والفيزياء والكيمياء.",
      },
    },

    skills: {
      title: "المهارات التقنية",
      subtitle: "التقنيات التي أعمل بها",
      frontend: { title: "تطوير الواجهة الأمامية" },
      backend: { title: "تطوير الواجهة الخلفية" },
      tools: { title: "الأدوات والتقنيات" },
      languages: {
        title: "اللغات",
        arabic: "العربية",
        french: "الفرنسية",
        english: "الإنجليزية",
        native: "اللغة الأم",
        fluent: "طلاقة",
        intermediate: "متوسط",
      },
    },

    projects: {
      title: "المشاريع والخبرة",
      subtitle: "بعض من أعمالي",
      sav: {
        title: "نظام إدارة خدمة ما بعد البيع",
        description:
          "نظام شامل للتذاكر والتشخيص مع دعم متعدد اللغات.",
        feature1: "نظام التذاكر",
        feature2: "أدوات التشخيص",
        feature3: "دعم متعدد اللغات",
      },
      survey: {
        title: "منشئ الاستطلاعات الديناميكي",
        description:
          "نظام متقدم لإنشاء استطلاعات ديناميكية باستخدام Angular FormArray.",
        feature1: "أسئلة متداخلة",
        feature2: "منطق التجميع",
        feature3: "عرض ديناميكي",
      },
      android: {
        title: "تطبيق المهام",
        description:
          "تطبيق بسيط لإدارة المهام مع مزامنة Firebase.",
        feature1: "إدارة المهام",
        feature2: "مزامنة سحابية",
        feature3: "وضع دون اتصال",
      },
      product: {
        title: "وحدة خصائص المنتج",
        description:
          "إدارة هرمية للمنتجات عبر عدة مستويات من الخصائص.",
        feature1: "نظام هرمي",
        feature2: "واجهة تشخيص",
        feature3: "إدارة المنتجات",
      },
      table: {
        title: "مكون الجدول الديناميكي",
        description:
          "جدول Angular قابل لإعادة الاستخدام مع فرز وتصفية.",
        feature1: "عناوين ديناميكية",
        feature2: "فرز وتصفية",
        feature3: "تصميم متجاوب",
      },
      multilang: {
        title: "نظام متعدد اللغات",
        description:
          "دعم شامل للعربية والفرنسية والإنجليزية.",
        feature1: "تبديل مباشر",
        feature2: "دعم RTL",
        feature3: "تحديثات ديناميكية",
      },
      marketplace: {
        title: "منصة سوق متكاملة",
        description:
          "تتضمن منتجات وسلة وصفحات عروض وحجوزات.",
        feature1: "تدفق السلة",
        feature2: "إدارة الحجز",
        feature3: "صفحات الشركات",
      },
      filtering: {
        title: "محرك التصفية الديناميكي",
        description:
          "محرك بحث متعدد المعايير قابل للتوسيع.",
        feature1: "فلاتر متعددة",
        feature2: "إعادة تعيين",
        feature3: "بحث مؤجل",
      },
      relation: {
        title: "ربط البيانات بالسياق",
        description:
          "عرض البيانات وفق علاقاتها السياقية.",
        feature1: "مقاطع حسب المجموعات",
        feature2: "ربط ثنائي الاتجاه",
        feature3: "هيكلة واضحة",
      },
      devtools: {
        title: "أدوات التطوير",
        description:
          "أدوات CLI لتسهيل التطوير وإدارة المنافذ.",
        feature1: "تنظيف المنافذ",
        feature2: "مراقبة العمليات",
        feature3: "تهيئة سريعة",
      },
      checklist: {
        title: "أداة قوائم التحقق",
        description:
          "مساعدة المختبرين في تشخيص الأعطال.",
        feature1: "قوائم ديناميكية",
        feature2: "تحديثات فورية",
        feature3: "منطق شرطي",
      },
      dashboard: {
        title: "لوحات التحكم",
        description:
          "لوحات إدارة قابلة للتخصيص.",
        feature1: "أقسام قابلة للطي",
        feature2: "جداول قابلة للتصفية",
        feature3: "مكونات معيارية",
      },
    },

    contact: {
      title: "تواصل معي",
      subtitle: "لنعمل معاً",
      connect: "لنتواصل",
      description:
        "أنا مهتم دائماً بالفرص الجديدة والمشاريع المبتكرة. لا تتردد في التواصل معي.",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      location: "الموقع",
      locationValue: "طنجة، المغرب",
      form: {
        name: "اسمك",
        email: "بريدك الإلكتروني",
        subject: "الموضوع",
        message: "رسالتك",
        send: "إرسال",
      },
    },

    footer: {
      copyright: "© 2024 زكرياء الشلي. جميع الحقوق محفوظة.",
      built: "مبني بـ HTML وCSS وJavaScript",
    },
  },

  /* ------------------------------------------------------
     ---------------------- SPANISH ------------------------
     ------------------------------------------------------ */

  es: {
    nav: {
      home: "Inicio",
      about: "Sobre mí",
      education: "Educación",
      skills: "Habilidades",
      projects: "Proyectos",
      contact: "Contacto",
    },
    hero: {
      subtitle:
        "Desarrollador Full Stack y Graduado en Ciencias de la Computación",
      description:
        "Especializado en Angular, TypeScript y tecnologías web modernas. Graduado en Ingeniería Informática por la Universidad Abdelmalek Essaadi.",
      location: "Tánger, Marruecos",
      viewWork: "Ver mi trabajo",
      getInTouch: "Contactar",
    },
    about: {
      title: "Sobre mí",
      subtitle: "Conóceme mejor",
      description1:
        "Soy un desarrollador Full Stack con sólida formación académica en Ciencias de la Computación. Obtuve una licenciatura en Ingeniería Informática en la Universidad Abdelmalek Essaadi.",
      description2:
        "Mi experiencia se centra en construir aplicaciones web escalables usando Angular, TypeScript y Node.js. Me apasiona crear formularios dinámicos y herramientas de diagnóstico.",
      stats: {
        study: "Años de estudio",
        projects: "Proyectos completados",
        languages: "Idiomas",
      },
      strengths: {
        title: "Fortalezas",
        item1: "Arquitectura basada en componentes en Angular",
        item2: "Validación eficiente y renderizado dinámico",
        item3: "Código limpio y depuración avanzada",
        item4: "Componentes UI reutilizables",
        item5: "Enfoque en la experiencia del usuario",
        item6: "Desarrollo multilingüe (árabe, francés, inglés)",
      },
    },

    education: {
      title: "Educación",
      subtitle: "Mi trayectoria académica",

      emsi: {
        title: "Ciclo de Ingeniería – Informática",
        subtitle:
          "École Marocaine des Sciences de l'Ingénieur (EMSI) – Tánger",
        institution:
          "EMSI Tánger – Especialidad Informática (4º año)",
        duration: "2025 - Presente",
        description:
          "Continuación de estudios de ingeniería en desarrollo avanzado de software, sistemas de información y computación aplicada.",
      },

      bachelor: {
        title: "Licenciatura en Ingeniería Informática",
        subtitle:
          "Licenciatura en Ciencias y Técnicas - Ingeniería Informática",
        institution:
          "Universidad Abdelmalek Essaadi, Facultad de Ciencias y Técnicas, Tánger",
        mention: "Mención: Bastante Bien",
        description:
          "Programa completo que cubre ingeniería de software, algoritmos, estructuras de datos y tecnologías web modernas.",
      },
      diploma: {
        title: "Diploma Universitario en Ciencia y Tecnología",
        subtitle:
          "Diploma de Estudios Universitarios en Ciencia y Tecnología",
        institution:
          "Universidad Abdelmalek Essaadi, Facultad de Ciencias y Técnicas, Tánger",
        mention:
          "Especialidad: Matemáticas-Informática-Física | Mención: Aprobado",
      },
      bac: {
        title: "Bachillerato en Ciencias Físicas",
        subtitle: "2º Año de Bachillerato en Ciencias Físicas",
        institution: "Liceo Abdellah Chefchaouni, Tánger",
        mention: "Mención: Bien",
        description:
          "Formación sólida en Matemáticas, Física y Química.",
      },
    },

    skills: {
      title: "Habilidades Técnicas",
      subtitle: "Tecnologías con las que trabajo",
      frontend: { title: "Desarrollo Frontend" },
      backend: { title: "Desarrollo Backend" },
      tools: { title: "Herramientas y Tecnologías" },
      languages: {
        title: "Idiomas",
        arabic: "Árabe",
        french: "Francés",
        english: "Inglés",
        native: "Nativo",
        fluent: "Fluido",
        intermediate: "Intermedio",
      },
    },

    projects: {
      title: "Proyectos y Experiencia",
      subtitle: "Algunos de mis trabajos",
      sav: {
        title: "Sistema de Gestión SAV",
        description:
          "Sistema completo de tickets y diagnóstico con soporte multilingüe.",
        feature1: "Sistema de Tickets",
        feature2: "Herramientas de Diagnóstico",
        feature3: "Soporte Multilingüe",
      },
      survey: {
        title: "Constructor de Encuestas",
        description:
          "Sistema dinámico de encuestas con Angular FormArray.",
        feature1: "Preguntas Anidadas",
        feature2: "Lógica de Grupo",
        feature3: "Renderizado Dinámico",
      },
      android: {
        title: "App Android de Tareas",
        description:
          "Aplicación minimalista con sincronización Firebase.",
        feature1: "Gestión de Tareas",
        feature2: "Sincronización en la Nube",
        feature3: "Modo Offline",
      },
      product: {
        title: "Módulo de Características",
        description:
          "Modelo jerárquico basado en varios niveles.",
        feature1: "Modelo Jerárquico",
        feature2: "Interfaz de Diagnóstico",
        feature3: "Gestión de Productos",
      },
      table: {
        title: "Tabla Dinámica",
        description:
          "Tabla reutilizable con clasificación y filtros.",
        feature1: "Encabezados Dinámicos",
        feature2: "Clasificación y Filtros",
        feature3: "Diseño Responsivo",
      },
      multilang: {
        title: "Sistema Multilenguaje",
        description:
          "Soporte para árabe, francés e inglés.",
        feature1: "Cambio Directo",
        feature2: "Soporte RTL",
        feature3: "Actualizaciones Dinámicas",
      },
      marketplace: {
        title: "Marketplace Completo",
        description:
          "Incluye productos, carrito, páginas empresa y reservas.",
        feature1: "Flujo del Carrito",
        feature2: "Gestión de Reservas",
        feature3: "Páginas de Empresa",
      },
      filtering: {
        title: "Motor de Filtrado",
        description:
          "Sistema escalable de búsquedas multicriterio.",
        feature1: "Filtros Multicriterio",
        feature2: "Chips y Reinicio",
        feature3: "Búsqueda Diferida",
      },
      relation: {
        title: "Vinculación Contextual",
        description:
          "UI estructurada por grupos y relaciones.",
        feature1: "Secciones por Grupo",
        feature2: "Vinculación Bidireccional",
        feature3: "Componentes Limpios",
      },
      devtools: {
        title: "Herramientas de Desarrollo",
        description:
          "Scripts CLI para puertos y automatización.",
        feature1: "Limpieza de Puertos",
        feature2: "Monitoreo de Procesos",
        feature3: "Setup Rápido",
      },
      checklist: {
        title: "Herramienta de Checklist",
        description:
          "Motor para pruebas y mantenimiento.",
        feature1: "Listas Dinámicas",
        feature2: "Estado en Tiempo Real",
        feature3: "Lógica Condicional",
      },
      dashboard: {
        title: "Paneles Admin",
        description:
          "Paneles filtrables y modulares.",
        feature1: "Secciones Colapsables",
        feature2: "Tablas Filtrables",
        feature3: "Componentes Modulares",
      },
    },

    contact: {
      title: "Contactar",
      subtitle: "Trabajemos juntos",
      connect: "Conectar",
      description:
        "Siempre estoy interesado en oportunidades nuevas. ¡Contáctame si quieres colaborar!",
      email: "Correo",
      phone: "Teléfono",
      location: "Ubicación",
      locationValue: "Tánger, Marruecos",
      form: {
        name: "Tu Nombre",
        email: "Tu Email",
        subject: "Asunto",
        message: "Tu Mensaje",
        send: "Enviar Mensaje",
      },
    },

    footer: {
      copyright: "© 2024 Zakariae Chelle. Todos los derechos reservados.",
      built: "Construido con HTML, CSS y JavaScript",
    },
  },
};

// Language flags and names
const languageFlags = {
  en: "🇺🇸",
  fr: "🇫🇷",
  ar: "🇲🇦",
  es: "🇪🇸",
}

const languageNames = {
  en: "EN",
  fr: "FR",
  ar: "ع",
  es: "ES",
}

// DOM Elements
const navbar = document.getElementById("navbar")
const navToggle = document.getElementById("nav-toggle")
const navMenu = document.getElementById("nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const themeToggle = document.getElementById("theme-toggle")
const contactForm = document.getElementById("contact-form")
const languageBtn = document.getElementById("language-btn")
const languageDropdown = document.getElementById("language-dropdown")
const languageOptions = document.querySelectorAll(".language-option")

// Current language state
let currentLanguage = localStorage.getItem("language") || "en"

// Theme Management
let isDarkMode = localStorage.getItem("darkMode") === "true"

function initTheme() {
  if (isDarkMode) {
    document.documentElement.setAttribute("data-theme", "dark")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  } else {
    document.documentElement.removeAttribute("data-theme")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  }
}

function toggleTheme() {
  isDarkMode = !isDarkMode
  localStorage.setItem("darkMode", isDarkMode)

  if (isDarkMode) {
    document.documentElement.setAttribute("data-theme", "dark")
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
  } else {
    document.documentElement.removeAttribute("data-theme")
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
  }
}

// Language Management
function updateLanguage(lang) {
  currentLanguage = lang
  localStorage.setItem("language", lang)

  // Update HTML attributes
  document.documentElement.lang = lang
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"

  // Update current language display
  const currentLangSpan = languageBtn.querySelector(".current-lang")
  currentLangSpan.textContent = `${languageFlags[lang]} ${languageNames[lang]}`

  // Update active language option
  languageOptions.forEach((option) => {
    option.classList.remove("active")
    if (option.dataset.lang === lang) {
      option.classList.add("active")
    }
  })

  // Translate all elements
  translatePage(lang)

  // Close dropdown
  closeLanguageDropdown()
}

function translatePage(lang) {
  const elements = document.querySelectorAll("[data-translate]")

  elements.forEach((element) => {
    const key = element.getAttribute("data-translate")
    const translation = getNestedTranslation(translations[lang], key)

    if (translation) {
      // Add fade transition
      element.classList.add("fade-transition")

      setTimeout(() => {
        element.textContent = translation
        element.classList.remove("fade-transition")
        element.classList.add("visible")

        setTimeout(() => {
          element.classList.remove("visible")
        }, 300)
      }, 150)
    }
  })

  // Update page title
  const titleTranslations = {
    en: "Zakariae Chelle - Full Stack Developer Portfolio",
    fr: "Zakariae Chelle - Portfolio Développeur Full Stack",
    ar: "زكرياء الشلي - محفظة مطور ويب متكامل",
  }
  document.title = titleTranslations[lang]
}

function getNestedTranslation(obj, key) {
  return key.split(".").reduce((o, k) => o && o[k], obj)
}

function toggleLanguageDropdown() {
  languageDropdown.classList.toggle("show")
  languageBtn.classList.toggle("active")
}

function closeLanguageDropdown() {
  languageDropdown.classList.remove("show")
  languageBtn.classList.remove("active")
}

// Mobile Navigation
function toggleMobileMenu() {
  navMenu.classList.toggle("active")
  navToggle.classList.toggle("active")
}

function closeMobileMenu() {
  navMenu.classList.remove("active")
  navToggle.classList.remove("active")
}

// Smooth Scrolling and Active Link Management
function updateActiveLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPosition = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")

    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active")
        }
      })
    }
  })
}

// Navbar Background on Scroll
function handleNavbarScroll() {
  if (window.scrollY > 50) {
    navbar.style.background = isDarkMode ? "rgba(26, 32, 44, 0.98)" : "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  } else {
    navbar.style.background = isDarkMode ? "rgba(26, 32, 44, 0.95)" : "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "none"
  }
}

// Contact Form Handling
// function handleContactForm(e) {
//   e.preventDefault()

//   const submitButton = contactForm.querySelector('button[type="submit"]')
//   const originalText = submitButton.innerHTML

//   // Get current language for success message
//   const successMessages = {
//     en: "Message sent successfully!",
//     fr: "Message envoyé avec succès!",
//     ar: "تم إرسال الرسالة بنجاح!",
//   }

//   // Show loading state
//   const loadingTexts = {
//     en: "Sending...",
//     fr: "Envoi en cours...",
//     ar: "جاري الإرسال...",
//   }

//   submitButton.innerHTML = `<span>${loadingTexts[currentLanguage]}</span>`
//   submitButton.disabled = true

//   // Simulate form submission
//   setTimeout(() => {
//     // Reset form
//     contactForm.reset()

//     // Show success message
//     const sentTexts = {
//       en: "Message Sent!",
//       fr: "Message Envoyé!",
//       ar: "تم الإرسال!",
//     }

//     submitButton.innerHTML = `<i class="fas fa-check"></i> ${sentTexts[currentLanguage]}`
//     submitButton.style.background = "#48bb78"

//     // Reset button after 3 seconds
//     setTimeout(() => {
//       submitButton.innerHTML = originalText
//       submitButton.disabled = false
//       submitButton.style.background = ""
//     }, 3000)

//     alert(successMessages[currentLanguage])
//   }, 2000)
// }

function handleContactForm(e) {
  e.preventDefault();

  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const subject = document.getElementById("subject").value;
  const message = document.getElementById("message").value;

  const loadingTexts = {
    en: "Sending...",
    fr: "Envoi en cours...",
    ar: "جاري الإرسال...",
  };
  const successMessages = {
    en: "Message sent successfully!",
    fr: "Message envoyé avec succès!",
    ar: "تم إرسال الرسالة بنجاح!",
  };
  const sentTexts = {
    en: "Message Sent!",
    fr: "Message Envoyé!",
    ar: "تم الإرسال!",
  };

  submitButton.innerHTML = `<span>${loadingTexts[currentLanguage]}</span>`;
  submitButton.disabled = true;

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    name,
    email,
    subject,
    message,
  }).then(() => {
    contactForm.reset();
    submitButton.innerHTML = `<i class="fas fa-check"></i> ${sentTexts[currentLanguage]}`;
    submitButton.style.background = "#48bb78";

    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      submitButton.style.background = "";
    }, 3000);

    alert(successMessages[currentLanguage]);
  }, (error) => {
    console.error("EmailJS error:", error);
    alert("An error occurred while sending the message. Please try again later.");
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  });
}


// Smooth Scroll to Section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    const offsetTop = section.offsetTop - 70
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    })
  }
}

// Animate skill bars
function animateSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress")

  skillBars.forEach((bar) => {
    const width = bar.getAttribute("data-width")
    if (width) {
      bar.style.width = width + "%"
    }
  })
}

// Initialize Everything
function init() {
  // Initialize theme
  initTheme()

  // Initialize language
  updateLanguage(currentLanguage)

  // Animate skill bars when skills section is visible
  const skillsSection = document.getElementById("skills")
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateSkillBars()
        observer.unobserve(entry.target)
      }
    })
  })

  if (skillsSection) {
    observer.observe(skillsSection)
  }

  // Set up event listeners
  themeToggle.addEventListener("click", toggleTheme)
  navToggle.addEventListener("click", toggleMobileMenu)
  contactForm.addEventListener("submit", handleContactForm)
  languageBtn.addEventListener("click", toggleLanguageDropdown)

  // Language option event listeners
  languageOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const lang = option.dataset.lang
      updateLanguage(lang)
    })
  })

  // Close mobile menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href").substring(1)
      scrollToSection(targetId)
      closeMobileMenu()
    })
  })

  // Scroll event listeners
  window.addEventListener("scroll", () => {
    updateActiveLink()
    handleNavbarScroll()
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
      closeMobileMenu()
    }

    if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
      closeLanguageDropdown()
    }
  })
}

// Start the application
document.addEventListener("DOMContentLoaded", init)

// Handle resize events
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMobileMenu()
  }
})

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  // Close dropdowns with Escape key
  if (e.key === "Escape") {
    closeMobileMenu()
    closeLanguageDropdown()
  }

  // Theme toggle with Ctrl/Cmd + D
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault()
    toggleTheme()
  }

  // Language toggle with Ctrl/Cmd + L
  if ((e.ctrlKey || e.metaKey) && e.key === "l") {
    e.preventDefault()
    toggleLanguageDropdown()
  }
})
