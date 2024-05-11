import { Card, CardContent, CardHeader } from '../ui/card'

type FlashcardProps = {
  question: string
  answer: string
}

export const Flashcard = ({ question, answer }: FlashcardProps) => {
  return (
    <Card>
      <CardHeader>
        <p className="m-auto font-bold">{question}</p>
      </CardHeader>
      <CardContent>
        <p className="m-auto w-fit">{answer}</p>
      </CardContent>
    </Card>
  )
}
