import TestimonialCard from '../TestimonialCard';

export default function TestimonialCardExample() {
  return (
    <div className="max-w-md">
      <TestimonialCard
        name="Amina Hassan"
        location="Nairobi, Kenya"
        comment="These recipes brought back childhood memories! The instructions are clear and authentic. My family loves every dish I've made."
        rating={5}
        initials="AH"
      />
    </div>
  );
}
