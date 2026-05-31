import type { PrismaClient } from '@prisma/client'
import { CHAPTER_NODE_TYPE } from './constants'

export async function seedCore(prisma: PrismaClient) {
  await prisma.metricSnapshot.deleteMany()
  await prisma.questionConcept.deleteMany()
  await prisma.questionChapter.deleteMany()
  await prisma.question.deleteMany()
  await prisma.flashcard.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.concept.deleteMany()
  await prisma.subject.deleteMany()
  await prisma.source.deleteMany()
  await prisma.difficulty.deleteMany()

  const difficulties = await Promise.all(
    [
      { name: 'Easy', slug: 'easy', sortOrder: 1 },
      { name: 'Medium', slug: 'medium', sortOrder: 2 },
      { name: 'Hard', slug: 'hard', sortOrder: 3 },
      { name: 'Very Hard', slug: 'very-hard', sortOrder: 4 },
    ].map((d) => prisma.difficulty.create({ data: d })),
  )

  const difficultyByName = Object.fromEntries(difficulties.map((d) => [d.name, d]))

  const sources = await Promise.all(
    [
      { name: 'JEE Main', slug: 'jee-main' },
      { name: 'JEE Advanced', slug: 'jee-advanced' },
      { name: 'Board', slug: 'board' },
      { name: 'NEET', slug: 'neet' },
    ].map((s) => prisma.source.create({ data: s })),
  )

  const sourceByName = Object.fromEntries(sources.map((s) => [s.name, s]))

  const subjects = await Promise.all(
    [
      { name: 'Physics', slug: 'physics', chartColor: '#7a6ee8' },
      { name: 'Chemistry', slug: 'chemistry', chartColor: '#65b741' },
      { name: 'Mathematics', slug: 'mathematics', chartColor: '#f59e0b' },
    ].map((s) => prisma.subject.create({ data: s })),
  )

  const subjectBySlug = Object.fromEntries(subjects.map((s) => [s.slug, s]))

  const concepts = await Promise.all(
    [
      'Velocity',
      'Acceleration',
      'Equations of Motion',
      'Kinetic Energy',
      'Potential Energy',
      'Conservation',
      'Mole Concept',
      'Chemical Reactions',
      'Derivatives',
      'Limits',
    ].map((name) =>
      prisma.concept.create({
        data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') },
      }),
    ),
  )

  const conceptByName = Object.fromEntries(concepts.map((c) => [c.name, c]))

  const physics = subjectBySlug.physics
  const chemistry = subjectBySlug.chemistry
  const mathematics = subjectBySlug.mathematics

  const mechanics = await prisma.chapter.create({
    data: {
      name: 'Mechanics & Motion',
      slug: 'mechanics',
      nodeType: CHAPTER_NODE_TYPE.TOPIC,
      subjectId: physics.id,
    },
  })

  const thermodynamics = await prisma.chapter.create({
    data: {
      name: 'Thermodynamics',
      slug: 'thermodynamics',
      nodeType: CHAPTER_NODE_TYPE.TOPIC,
      subjectId: physics.id,
    },
  })

  const mechLevels = await Promise.all(
    [
      { name: 'Level 1', slug: 'mech-l1', count: 35, difficulty: 'Easy' },
      { name: 'Level 2', slug: 'mech-l2', count: 48, difficulty: 'Medium' },
      { name: 'Level 3', slug: 'mech-l3', count: 20, difficulty: 'Hard' },
    ].map((level) =>
      prisma.chapter.create({
        data: {
          name: level.name,
          slug: level.slug,
          nodeType: CHAPTER_NODE_TYPE.LEVEL,
          catalogQuestionCount: level.count,
          subjectId: physics.id,
          parentId: mechanics.id,
          displayDifficultyId: difficultyByName[level.difficulty].id,
        },
      }),
    ),
  )

  await Promise.all(
    [
      { name: 'Level 1', slug: 'thermo-l1', count: 28, difficulty: 'Easy' },
      { name: 'Level 2', slug: 'thermo-l2', count: 42, difficulty: 'Medium' },
    ].map((level) =>
      prisma.chapter.create({
        data: {
          name: level.name,
          slug: level.slug,
          nodeType: CHAPTER_NODE_TYPE.LEVEL,
          catalogQuestionCount: level.count,
          subjectId: physics.id,
          parentId: thermodynamics.id,
          displayDifficultyId: difficultyByName[level.difficulty].id,
        },
      }),
    ),
  )

  const inorganic = await prisma.chapter.create({
    data: {
      name: 'Inorganic Chemistry',
      slug: 'inorganic',
      nodeType: CHAPTER_NODE_TYPE.TOPIC,
      subjectId: chemistry.id,
    },
  })

  await Promise.all(
    [
      { name: 'Mole Concept', slug: 'inorg-mole', count: 52, difficulty: 'Medium' },
      { name: 'Chemical Reactions', slug: 'inorg-reactions', count: 38, difficulty: 'Hard' },
    ].map((level) =>
      prisma.chapter.create({
        data: {
          name: level.name,
          slug: level.slug,
          nodeType: CHAPTER_NODE_TYPE.LEVEL,
          catalogQuestionCount: level.count,
          subjectId: chemistry.id,
          parentId: inorganic.id,
          displayDifficultyId: difficultyByName[level.difficulty].id,
        },
      }),
    ),
  )

  const calculus = await prisma.chapter.create({
    data: {
      name: 'Calculus',
      slug: 'calculus',
      nodeType: CHAPTER_NODE_TYPE.TOPIC,
      subjectId: mathematics.id,
    },
  })

  await Promise.all(
    [
      { name: 'Limits & Derivatives', slug: 'calc-limits', count: 64, difficulty: 'Hard' },
      { name: 'Integration', slug: 'calc-integration', count: 45, difficulty: 'Hard' },
    ].map((level) =>
      prisma.chapter.create({
        data: {
          name: level.name,
          slug: level.slug,
          nodeType: CHAPTER_NODE_TYPE.LEVEL,
          catalogQuestionCount: level.count,
          subjectId: mathematics.id,
          parentId: calculus.id,
          displayDifficultyId: difficultyByName[level.difficulty].id,
        },
      }),
    ),
  )

  const kinematicsChapter = await prisma.chapter.create({
    data: {
      name: 'Kinematics',
      slug: 'kinematics',
      nodeType: CHAPTER_NODE_TYPE.TOPIC,
      subjectId: physics.id,
    },
  })

  const workEnergyChapter = await prisma.chapter.create({
    data: {
      name: 'Work, Energy & Power',
      slug: 'work-energy-power',
      nodeType: CHAPTER_NODE_TYPE.TOPIC,
      subjectId: physics.id,
    },
  })

  const jeeMain2023 = await prisma.source.create({
    data: { name: 'JEE Main 2023', slug: 'jee-main-2023' },
  })

  const practiceQuestions = [
    {
      questionNumber: 1,
      content:
        'A particle starts from rest and moves along a straight line. If its acceleration is given by a = 2t m/s² where t is in seconds, then the distance covered in the first 4 seconds is?',
      sourceId: jeeMain2023.id,
      difficultyId: difficultyByName['Hard'].id,
      chapterId: kinematicsChapter.id,
      conceptNames: ['Velocity', 'Acceleration', 'Equations of Motion'],
      isDue: true,
    },
    {
      questionNumber: 2,
      content:
        'A ball is thrown upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)',
      sourceId: jeeMain2023.id,
      difficultyId: difficultyByName['Hard'].id,
      chapterId: workEnergyChapter.id,
      conceptNames: ['Kinetic Energy', 'Potential Energy', 'Conservation'],
      isDue: true,
    },
  ]

  for (const q of practiceQuestions) {
    await prisma.question.create({
      data: {
        content: q.content,
        questionNumber: q.questionNumber,
        sourceId: q.sourceId,
        difficultyId: q.difficultyId,
        isDue: q.isDue,
        chapters: { create: [{ chapterId: q.chapterId }] },
        concepts: {
          create: q.conceptNames.map((name) => ({
            conceptId: conceptByName[name].id,
          })),
        },
      },
    })
  }

  const duePlaceholders = 47 - practiceQuestions.length
  for (let i = 0; i < duePlaceholders; i++) {
    await prisma.question.create({
      data: {
        content: `Review question ${i + 3} — seeded placeholder for spaced repetition queue.`,
        sourceId: sourceByName['JEE Main'].id,
        difficultyId: difficultyByName['Medium'].id,
        isDue: true,
        chapters: { create: [{ chapterId: mechLevels[1].id }] },
        concepts: { create: [{ conceptId: conceptByName['Velocity'].id }] },
      },
    })
  }

  const stoichiometryChapter = await prisma.chapter.create({
    data: {
      name: 'Stoichiometry',
      slug: 'stoichiometry',
      nodeType: CHAPTER_NODE_TYPE.TOPIC,
      subjectId: chemistry.id,
    },
  })

  const calculusTopicChapter = await prisma.chapter.findFirst({
    where: { slug: 'calculus', subjectId: mathematics.id },
  })

  const flashcardSeeds = [
    {
      subjectId: physics.id,
      chapterId: kinematicsChapter.id,
      conceptId: conceptByName['Equations of Motion'].id,
      front: 'What are the three equations of motion?',
      back: 'The three equations of motion are: v = u + at, s = ut + ½at², and v² = u² + 2as',
      due: true,
    },
    {
      subjectId: chemistry.id,
      chapterId: stoichiometryChapter.id,
      conceptId: conceptByName['Mole Concept'].id,
      front: "Define Avogadro's Number",
      back: "Avogadro's number is 6.022 × 10²³, representing the number of particles in one mole of a substance.",
      due: true,
    },
    {
      subjectId: mathematics.id,
      chapterId: calculusTopicChapter!.id,
      conceptId: conceptByName['Derivatives'].id,
      front: 'What is the derivative of sin(x)?',
      back: 'The derivative of sin(x) is cos(x)',
      due: true,
    },
  ]

  for (const card of flashcardSeeds) {
    await prisma.flashcard.create({
      data: {
        front: card.front,
        back: card.back,
        subjectId: card.subjectId,
        chapterId: card.chapterId,
        conceptId: card.conceptId,
        nextReviewAt: card.due ? new Date() : null,
      },
    })
  }

  const dueFlashcards = 23 - flashcardSeeds.length
  for (let i = 0; i < dueFlashcards; i++) {
    await prisma.flashcard.create({
      data: {
        front: `Flashcard review ${i + 4}`,
        back: 'Seeded answer for due flashcard queue.',
        subjectId: physics.id,
        chapterId: mechLevels[0].id,
        nextReviewAt: new Date(),
      },
    })
  }
}
