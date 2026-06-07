import type { PrismaClient } from '@prisma/client'

type DifficultyMap = Record<string, { id: string }>
type SourceMap = Record<string, { id: string }>
type SubjectMap = Record<string, { id: string }>

export async function seedCatalogHierarchy(
  prisma: PrismaClient,
  difficultyByName: DifficultyMap,
  sourceByName: SourceMap,
  subjectBySlug: SubjectMap,
) {
  const physics = subjectBySlug.physics
  const chemistry = subjectBySlug.chemistry
  const mathematics = subjectBySlug.mathematics
  const jeeMain = sourceByName['JEE Main']

  const catalogChapters = [
    {
      subjectId: physics.id,
      sourceId: jeeMain.id,
      name: 'Mechanics & Motion',
      slug: 'mechanics-motion',
      count: 103,
      difficulty: 'Medium',
      concepts: ['Velocity', 'Acceleration', 'Equations of Motion'],
    },
    {
      subjectId: physics.id,
      sourceId: jeeMain.id,
      name: 'Thermodynamics',
      slug: 'thermodynamics-catalog',
      count: 70,
      difficulty: 'Medium',
      concepts: ['Heat Transfer', 'Entropy'],
    },
    {
      subjectId: chemistry.id,
      sourceId: jeeMain.id,
      name: 'Inorganic Chemistry',
      slug: 'inorganic-catalog',
      count: 90,
      difficulty: 'Hard',
      concepts: ['Mole Concept', 'Chemical Reactions'],
    },
    {
      subjectId: mathematics.id,
      sourceId: jeeMain.id,
      name: 'Calculus',
      slug: 'calculus-catalog',
      count: 109,
      difficulty: 'Hard',
      concepts: ['Derivatives', 'Limits'],
    },
  ]

  for (const entry of catalogChapters) {
    const chapter = await prisma.chapter.create({
      data: {
        name: entry.name,
        slug: entry.slug,
        nodeType: 'CHAPTER',
        catalogQuestionCount: entry.count,
        subjectId: entry.subjectId,
        sourceId: entry.sourceId,
        displayDifficultyId: difficultyByName[entry.difficulty].id,
      },
    })

    const conceptRecords = []
    for (const conceptName of entry.concepts) {
      const concept = await prisma.concept.create({
        data: {
          name: conceptName,
          slug: conceptName.toLowerCase().replace(/\s+/g, '-'),
          chapterId: chapter.id,
        },
      })
      conceptRecords.push(concept)
    }

    if (entry.slug === 'mechanics-motion') {
      await prisma.question.create({
        data: {
          content:
            'A particle starts from rest and moves along a straight line. If its acceleration is given by a = 2t m/s² where t is in seconds, then the distance covered in the first 4 seconds is?',
          questionNumber: 1,
          sourceId: jeeMain.id,
          difficultyId: difficultyByName['Hard'].id,
          chapters: { create: [{ chapterId: chapter.id }] },
          concepts: {
            create: conceptRecords
              .filter((c) => ['Velocity', 'Acceleration', 'Equations of Motion'].includes(c.name))
              .map((c) => ({ conceptId: c.id })),
          },
        },
      })
    }
  }
}
