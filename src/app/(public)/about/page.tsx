export const metadata = {
  title: "About Us - CalcHub",
  description: "Learn more about CalcHub, our story, and our mission to provide the best free online tools.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">About CalcHub</h1>
      
      <div className="prose prose-blue prose-lg text-gray-700">
        <p>
          Welcome to <strong>CalcHub</strong>, your ultimate destination for free, reliable, and user-friendly online calculators. 
          Our mission is to simplify your life by providing the tools you need to make quick, accurate calculations.
        </p>
        
        <h2>Our Story</h2>
        <p>
          CalcHub was founded with a simple idea: everyone should have access to accurate, fast, and beautifully designed tools. 
          Whether you're calculating your BMI, checking personal loan terms with our EMI calculator, or keeping track of your exact age, we've got you covered.
        </p>
        
        <h2>Why Choose Us?</h2>
        <ul>
          <li><strong>Free to use:</strong> No hidden fees or subscriptions.</li>
          <li><strong>Privacy first:</strong> All calculations are done locally in your browser when possible. We don't store your personal health or financial data.</li>
          <li><strong>Fast and Mobile-friendly:</strong> Our tools are designed to work perfectly on any device, ensuring you get the answers you need, anywhere.</li>
        </ul>
      </div>
    </div>
  );
}
