import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { MyGrade } from '@shared/types/srs'
// import { Rating } from '@shared/types/srs'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/flashcards/study')({
  component: FlashcardStudyPage,
})

function FlashcardStudyPage() {
  const navigate = useNavigate()

  // TODO: Do I need to get all the flashcards here? Could I just get one
  //       and then cache it & use that value for the study page?
  const {
    data: flashcards,
    isLoading,
    isError,
  } = trpc.srs.getScheduledCards.useQuery()

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!flashcards || flashcards.length === 0) {
    navigate({ to: '/flashcards/initialize' })
  }

  return <FlashcardStudy />
}

function FlashcardStudy() {
  const [showAnswer, setShowAnswer] = useState(false)
  const { data, isLoading, isError } = trpc.srs.getNextScheduledCard.useQuery()
  const trpcUtils = trpc.useUtils()
  const mutation = trpc.srs.studyCard.useMutation({
    onSuccess: () => {
      // Move to the next card
      trpcUtils.srs.getNextScheduledCard.invalidate()

      setShowAnswer(false)
    },
  })

  // TODO: This state handling is getting tiresome. Maybe Suspense?
  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>No flashcard</div>
  }

  const grades = Object.values(MyGrade)
    .map((gradeString) => Number(gradeString))
    .filter((grade) => !isNaN(grade))

  return (
    <Card>
      <div
        className="flex flex-col justify-center gap-8"
        onClick={() => setShowAnswer(true)}
      >
        <div className="flex flex-col justify-center text-center">
          <p>{data.flashcard.question}</p>
          <p className={`${showAnswer ? 'opacity-100' : 'opacity-0'}`}>
            {data.flashcard.answer}
          </p>
        </div>
        <div className="w-fit m-auto flex gap-2 h-10">
          {showAnswer &&
            grades.map((grade) => (
              <Button
                key={grade}
                onClick={() =>
                  mutation.mutate({
                    userFlashcardId: data.id,
                    grade: grade as MyGrade,
                  })
                }
              >
                {MyGrade[Number(grade)]}
              </Button>
            ))}
        </div>
      </div>
    </Card>
  )
}
