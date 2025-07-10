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
      bachelor: {
        title: "Bachelor's Degree in Computer Engineering",
        subtitle: "Licence en Sciences et Techniques - Génie Informatique",
        institution: "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention: "Mention: Assez Bien (Good)",
        description:
          "Comprehensive program covering software engineering, algorithms, data structures, and modern web technologies.",
      },
      diploma: {
        title: "University Diploma in Science and Technology",
        subtitle: "Diplôme d'Études Universitaires en Sciences et Techniques",
        institution: "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention: "Filière: Mathématiques-Informatique-Physique | Mention: Passable",
      },
      bac: {
        title: "Baccalauréat in Physical Sciences",
        subtitle: "2ème Année BAC Sciences Physiques",
        institution: "Lycée Qualifiant Abdellah Chefchaouni, Tanger",
        mention: "Mention: Bien (Good)",
        description: "Specialized in Physical Sciences with strong foundation in Mathematics, Physics, and Chemistry.",
      },
    },
    skills: {
      title: "Technical Skills",
      subtitle: "Technologies I work with",
      frontend: {
        title: "Frontend Development",
      },
      backend: {
        title: "Backend Development",
      },
      tools: {
        title: "Tools & Technologies",
      },
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
        "Je suis un développeur Full Stack passionné avec une solide formation académique en informatique. J'ai obtenu un diplôme de licence en Génie Informatique de l'Université Abdelmalek Essaadi à Tanger, Maroc.",
      description2:
        "Mon expertise réside dans la création d'applications web évolutives utilisant des technologies modernes comme Angular, TypeScript et Node.js. J'ai une passion particulière pour la création de formulaires dynamiques, d'outils de diagnostic et de systèmes d'enquête qui offrent d'excellentes expériences utilisateur.",
      stats: {
        study: "Années d'Études",
        projects: "Projets Réalisés",
        languages: "Langues Parlées",
      },
      strengths: {
        title: "Forces Principales",
        item1: "Architecture basée sur les composants en Angular",
        item2: "Validation de formulaires efficace et rendu d'entrées dynamiques",
        item3: "Pratiques de code propre et compétences de débogage solides",
        item4: "Expérience dans la création de composants UI réutilisables",
        item5: "Axé sur l'expérience utilisateur et l'accessibilité",
        item6: "Développement multilingue (Arabe, Français, Anglais)",
      },
    },
    education: {
      title: "Formation",
      subtitle: "Mon parcours académique",
      bachelor: {
        title: "Licence en Génie Informatique",
        subtitle: "Licence en Sciences et Techniques - Génie Informatique",
        institution: "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention: "Mention: Assez Bien",
        description:
          "Programme complet couvrant le génie logiciel, les algorithmes, les structures de données et les technologies web modernes.",
      },
      diploma: {
        title: "Diplôme Universitaire en Sciences et Techniques",
        subtitle: "Diplôme d'Études Universitaires en Sciences et Techniques",
        institution: "Université Abdelmalek Essaadi, Faculté des Sciences et Techniques, Tanger",
        mention: "Filière: Mathématiques-Informatique-Physique | Mention: Passable",
      },
      bac: {
        title: "Baccalauréat en Sciences Physiques",
        subtitle: "2ème Année BAC Sciences Physiques",
        institution: "Lycée Qualifiant Abdellah Chefchaouni, Tanger",
        mention: "Mention: Bien",
        description: "Spécialisé en Sciences Physiques avec une base solide en Mathématiques, Physique et Chimie.",
      },
    },
    skills: {
      title: "Compétences Techniques",
      subtitle: "Technologies avec lesquelles je travaille",
      frontend: {
        title: "Développement Frontend",
      },
      backend: {
        title: "Développement Backend",
      },
      tools: {
        title: "Outils & Technologies",
      },
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
          "Système complet de billetterie et de diagnostic avec des caractéristiques imbriquées structurées et un support multilingue utilisant ngx-translate.",
        feature1: "Système de Billetterie",
        feature2: "Outils de Diagnostic",
        feature3: "Support Multilingue",
      },
      survey: {
        title: "Constructeur d'Enquêtes Dynamiques",
        description:
          "Système d'enquête avancé avec des composants réutilisables pour les questions imbriquées et le rendu de formulaires dynamiques utilisant Angular FormArray.",
        feature1: "Questions Imbriquées",
        feature2: "Logique de Groupe",
        feature3: "Rendu Dynamique",
      },
      android: {
        title: "Application Android To-Do",
        description:
          "Application de productivité minimaliste avec suivi des tâches et synchronisation Firebase pour une expérience transparente multi-appareils.",
        feature1: "Gestion des Tâches",
        feature2: "Synchronisation Cloud",
        feature3: "Support Hors Ligne",
      },
      product: {
        title: "Module de Caractéristiques Produit",
        description:
          "Système de gestion de produits hiérarchique avec architecture GroupeCaracteristique → CaracteristiqueDemandable → InstanceCaracteristique.",
        feature1: "Modèle Hiérarchique",
        feature2: "Interface de Diagnostic",
        feature3: "Gestion de Produits",
      },
      table: {
        title: "Composant de Tableau Dynamique",
        description:
          "Composant de tableau Angular réutilisable avec des fonctionnalités avancées incluant le tri, le filtrage et la conception responsive.",
        feature1: "En-têtes Dynamiques",
        feature2: "Tri et Filtrage",
        feature3: "Mise en Page Responsive",
      },
      multilang: {
        title: "Système Multi-langues",
        description:
          "Système d'internationalisation complet supportant l'arabe, le français et l'anglais avec changement de langue en direct.",
        feature1: "Changement de Langue en Direct",
        feature2: "Support RTL",
        feature3: "Mises à Jour Dynamiques",
      },
      marketplace: {
        title: "Plateforme Marketplace Complète",
        description:
          "Solution marketplace de bout en bout incluant les listes de produits, le système de panier, les présentations d'entreprise/événement et la gestion des réservations.",
        feature1: "Flux Panier et Commande",
        feature2: "Intégration Réservation",
        feature3: "Pages Entreprise et Événement",
      },
      filtering: {
        title: "Moteur de Filtrage Dynamique",
        description:
          "Système de filtrage réutilisable et évolutif pour la recherche multi-critères sur les objets, enquêtes et réservations.",
        feature1: "Filtres Multi-Critères",
        feature2: "Puces de Filtre et Réinitialisation",
        feature3: "Recherche Différée",
      },
      relation: {
        title: "Liaison de Données Basée sur les Relations",
        description:
          "Logique d'interface utilisateur structurée construite pour grouper et afficher les données par relations contextuelles dans les formulaires et listes dynamiques.",
        feature1: "Sections Basées sur les Groupes",
        feature2: "Liaison de Formulaire Bidirectionnelle",
        feature3: "Structure de Composant Propre",
      },
      devtools: {
        title: "Outils de Développement & Automatisation",
        description:
          "Outils CLI créés et scripts shell pour rationaliser les tâches de développement comme l'arrêt de processus et la gestion des ports.",
        feature1: "Scripts de Nettoyage de Port",
        feature2: "Surveillance de Processus",
        feature3: "Configuration Rapide d'Environnement",
      },
      checklist: {
        title: "Outil de Liste de Contrôle et Diagnostic",
        description:
          "Moteur de liste de contrôle dynamique construit pour aider les testeurs à identifier les problèmes lors des processus d'évaluation et de maintenance des produits.",
        feature1: "Listes de Contrôle Dynamiques",
        feature2: "Mises à Jour d'État en Temps Réel",
        feature3: "Support pour la Logique Conditionnelle",
      },
      dashboard: {
        title: "Panneaux de Tableau de Bord Admin",
        description:
          "Panneaux d'administration réutilisables et basculables développés pour visualiser, filtrer et gérer les entités de données backend dans une interface conviviale.",
        feature1: "Sections Pliables",
        feature2: "Tables de Données Filtrables",
        feature3: "Composants de Panneau Modulaires",
      },
    },
    contact: {
      title: "Entrer en Contact",
      subtitle: "Travaillons ensemble",
      connect: "Connectons-nous",
      description:
        "Je suis toujours intéressé par de nouvelles opportunités et des projets passionnants. N'hésitez pas à me contacter si vous souhaitez travailler ensemble !",
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
      description: "متخصص في Angular وTypeScript وتقنيات الويب الحديثة. خريج هندسة الحاسوب من جامعة عبد المالك السعدي.",
      location: "طنجة، المغرب",
      viewWork: "عرض أعمالي",
      getInTouch: "تواصل معي",
    },
    about: {
      title: "نبذة عني",
      subtitle: "تعرف علي أكثر",
      description1:
        "أنا مطور ويب متكامل شغوف بخلفية أكاديمية قوية في علوم الحاسوب. تخرجت بدرجة البكالوريوس في هندسة الحاسوب من جامعة عبد المالك السعدي في طنجة، المغرب.",
      description2:
        "تكمن خبرتي في بناء تطبيقات الويب القابلة للتطوير باستخدام التقنيات الحديثة مثل Angular وTypeScript وNode.js. لدي شغف خاص لإنشاء النماذج الديناميكية وأدوات التشخيص وأنظمة الاستطلاع التي توفر تجارب مستخدم ممتازة.",
      stats: {
        study: "سنوات الدراسة",
        projects: "المشاريع المكتملة",
        languages: "اللغات المنطوقة",
      },
      strengths: {
        title: "نقاط القوة الأساسية",
        item1: "هندسة معمارية قائمة على المكونات في Angular",
        item2: "التحقق من صحة النماذج الفعال وعرض المدخلات الديناميكي",
        item3: "ممارسات الكود النظيف ومهارات التصحيح القوية",
        item4: "خبرة في بناء مكونات واجهة المستخدم القابلة لإعادة الاستخدام",
        item5: "التركيز على تجربة المستخدم وإمكانية الوصول",
        item6: "التطوير متعدد اللغات (العربية، الفرنسية، الإنجليزية)",
      },
    },
    education: {
      title: "التعليم",
      subtitle: "رحلتي الأكاديمية",
      bachelor: {
        title: "درجة البكالوريوس في هندسة الحاسوب",
        subtitle: "إجازة في العلوم والتقنيات - الهندسة المعلوماتية",
        institution: "جامعة عبد المالك السعدي، كلية العلوم والتقنيات، طنجة",
        mention: "الميزة: مستحسن",
        description: "برنامج شامل يغطي هندسة البرمجيات والخوارزميات وهياكل البيانات وتقنيات الويب الحديثة.",
      },
      diploma: {
        title: "دبلوم جامعي في العلوم والتقنيات",
        subtitle: "دبلوم الدراسات الجامعية في العلوم والتقنيات",
        institution: "جامعة عبد المالك السعدي، كلية العلوم والتقنيات، طنجة",
        mention: "المسلك: الرياضيات-المعلوماتية-الفيزياء | الميزة: مقبول",
      },
      bac: {
        title: "البكالوريا في العلوم الفيزيائية",
        subtitle: "السنة الثانية باكالوريا العلوم الفيزيائية",
        institution: "الثانوية التأهيلية عبد الله الشفشاوني، طنجة",
        mention: "الميزة: حسن",
        description: "متخصص في العلوم الفيزيائية مع أساس قوي في الرياضيات والفيزياء والكيمياء.",
      },
    },
    skills: {
      title: "المهارات التقنية",
      subtitle: "التقنيات التي أعمل بها",
      frontend: {
        title: "تطوير الواجهة الأمامية",
      },
      backend: {
        title: "تطوير الواجهة الخلفية",
      },
      tools: {
        title: "الأدوات والتقنيات",
      },
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
      subtitle: "بعض من أعمالي الحديثة",
      sav: {
        title: "نظام إدارة خدمة ما بعد البيع",
        description: "نظام شامل للتذاكر والتشخيص مع خصائص متداخلة منظمة ودعم متعدد اللغات باستخدام ngx-translate.",
        feature1: "نظام التذاكر",
        feature2: "أدوات التشخيص",
        feature3: "الدعم متعدد اللغات",
      },
      survey: {
        title: "منشئ الاستطلاعات الديناميكي",
        description:
          "نظام استطلاع متقدم مع مكونات قابلة لإعادة الاستخدام للأسئلة المتداخلة وعرض النماذج الديناميكي باستخدام Angular FormArray.",
        feature1: "الأسئلة المتداخلة",
        feature2: "منطق المجموعة",
        feature3: "العرض الديناميكي",
      },
      android: {
        title: "تطبيق أندرويد للمهام",
        description: "تطبيق إنتاجية بسيط مع تتبع المهام ومزامنة Firebase لتجربة سلسة عبر الأجهزة.",
        feature1: "إدارة المهام",
        feature2: "المزامنة السحابية",
        feature3: "الدعم دون اتصال",
      },
      product: {
        title: "وحدة خصائص المنتج",
        description:
          "نظام إدارة منتجات هرمي مع هندسة GroupeCaracteristique → CaracteristiqueDemandable → InstanceCaracteristique.",
        feature1: "النموذج الهرمي",
        feature2: "واجهة التشخيص",
        feature3: "إدارة المنتجات",
      },
      table: {
        title: "مكون الجدول الديناميكي",
        description: "مكون جدول Angular قابل لإعادة الاستخدام مع ميزات متقدمة تشمل الفرز والتصفية والتصميم المتجاوب.",
        feature1: "العناوين الديناميكية",
        feature2: "الفرز والتصفية",
        feature3: "التخطيط المتجاوب",
      },
      multilang: {
        title: "نظام متعدد اللغات",
        description: "نظام تدويل شامل يدعم العربية والفرنسية والإنجليزية مع تبديل اللغة المباشر.",
        feature1: "تبديل اللغة المباشر",
        feature2: "دعم RTL",
        feature3: "التحديثات الديناميكية",
      },
      marketplace: {
        title: "منصة السوق الكاملة",
        description: "حل سوق شامل يتضمن قوائم المنتجات ونظام السلة وعروض الشركة/الحدث وإدارة الحجوزات.",
        feature1: "تدفق السلة والدفع",
        feature2: "تكامل الحجز",
        feature3: "صفحات الشركة والحدث",
      },
      filtering: {
        title: "محرك التصفية الديناميكي",
        description:
          "نظام تصفية قابل لإعادة الاستخدام وقابل للتطوير للبحث متعدد المعايير عبر الكائنات والاستطلاعات والحجوزات.",
        feature1: "مرشحات متعددة المعايير",
        feature2: "رقائق المرشح والإعادة تعيين",
        feature3: "البحث المؤجل",
      },
      relation: {
        title: "ربط البيانات القائم على العلاقات",
        description:
          "منطق واجهة مستخدم منظم مبني لتجميع وعرض البيانات حسب العلاقات السياقية في النماذج والقوائم الديناميكية.",
        feature1: "أقسام قائمة على المجموعات",
        feature2: "ربط النماذج ثنائي الاتجاه",
        feature3: "هيكل مكون نظيف",
      },
      devtools: {
        title: "أدوات التطوير والأتمتة",
        description: "أدوات CLI منشأة ونصوص shell لتبسيط مهام التطوير مثل إيقاف العمليات وإدارة المنافذ.",
        feature1: "نصوص تنظيف المنافذ",
        feature2: "مراقبة العمليات",
        feature3: "إعداد البيئة السريع",
      },
      checklist: {
        title: "أداة قائمة التحقق والتشخيص",
        description:
          "محرك قائمة تحقق ديناميكي مبني لمساعدة المختبرين في تحديد المشاكل أثناء عمليات تقييم المنتج والصيانة.",
        feature1: "قوائم تحقق ديناميكية",
        feature2: "تحديثات الحالة في الوقت الفعلي",
        feature3: "دعم المنطق الشرطي",
      },
      dashboard: {
        title: "لوحات تحكم الإدارة",
        description:
          "لوحات إدارة قابلة لإعادة الاستخدام وقابلة للتبديل مطورة لعرض وتصفية وإدارة كيانات البيانات الخلفية في واجهة سهلة الاستخدام.",
        feature1: "أقسام قابلة للطي",
        feature2: "جداول بيانات قابلة للتصفية",
        feature3: "مكونات لوحة معيارية",
      },
    },
    contact: {
      title: "تواصل معي",
      subtitle: "لنعمل معاً",
      connect: "لنتواصل",
      description:
        "أنا دائماً مهتم بالفرص الجديدة والمشاريع المثيرة. لا تتردد في التواصل معي إذا كنت ترغب في العمل معاً!",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      location: "الموقع",
      locationValue: "طنجة، المغرب",
      form: {
        name: "اسمك",
        email: "بريدك الإلكتروني",
        subject: "الموضوع",
        message: "رسالتك",
        send: "إرسال الرسالة",
      },
    },
    footer: {
      copyright: "© 2024 زكرياء الشلي. جميع الحقوق محفوظة.",
      built: "مبني بـ HTML وCSS وJavaScript",
    },
  },
}

// Language flags and names
const languageFlags = {
  en: "🇺🇸",
  fr: "🇫🇷",
  ar: "🇲🇦",
}

const languageNames = {
  en: "EN",
  fr: "FR",
  ar: "ع",
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
function handleContactForm(e) {
  e.preventDefault()

  const submitButton = contactForm.querySelector('button[type="submit"]')
  const originalText = submitButton.innerHTML

  // Get current language for success message
  const successMessages = {
    en: "Message sent successfully!",
    fr: "Message envoyé avec succès!",
    ar: "تم إرسال الرسالة بنجاح!",
  }

  // Show loading state
  const loadingTexts = {
    en: "Sending...",
    fr: "Envoi en cours...",
    ar: "جاري الإرسال...",
  }

  submitButton.innerHTML = `<span>${loadingTexts[currentLanguage]}</span>`
  submitButton.disabled = true

  // Simulate form submission
  setTimeout(() => {
    // Reset form
    contactForm.reset()

    // Show success message
    const sentTexts = {
      en: "Message Sent!",
      fr: "Message Envoyé!",
      ar: "تم الإرسال!",
    }

    submitButton.innerHTML = `<i class="fas fa-check"></i> ${sentTexts[currentLanguage]}`
    submitButton.style.background = "#48bb78"

    // Reset button after 3 seconds
    setTimeout(() => {
      submitButton.innerHTML = originalText
      submitButton.disabled = false
      submitButton.style.background = ""
    }, 3000)

    alert(successMessages[currentLanguage])
  }, 2000)
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
