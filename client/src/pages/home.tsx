import { Card, CardContent } from "@/components/ui/card";
import { Network, Users } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Always on Path, always with you.
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                We leverage cutting-edge technologies and innovative B2B SaaS solutions, helping businesses optimize workplace operations and elevate employee experiences.
              </p>
              <p className="text-lg text-blue-100">
                Our focus on AI, data analytics, and seamless integration ensures that companies remain agile and competitive in a rapidly evolving market.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="relative w-96 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Network className="h-16 w-16 text-white/80" />
                <div className="absolute top-4 right-4 w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                <div className="absolute top-1/3 left-4 w-4 h-4 bg-blue-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Background Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Background</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Modern office workspace with laptops and technology"
                className="rounded-xl shadow-lg w-full h-auto"
              />

              <Card className="mt-8 bg-primary text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Users className="h-6 w-6 mr-2" />
                    How We Met
                  </h3>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                Our journey began from our own experiences at our previous company. While working under intense pressure of our previous organization, we witnessed how thoughtful and consistent HR team can make an immeasurable difference in employees' wellbeing and performance. Their support enabled us to remain engaged, productive, and resilient—especially during challenging innovations.
              </p>

              <p className="text-gray-600 leading-relaxed">
                However, such experiences are not universal in many workplaces; employees lack safe channels to express concerns, and HR teams often face constraints in time, resources, and data visibility. These limitations hinder timely, personalized support, contributing to disengagement and high turnover.
              </p>

              <p className="text-gray-600 leading-relaxed">
                We set out to change that. By combining AI-driven sentiment analysis with real-time insights, our platform enables organizations to understand their people better, intervene more effectively, and foster a culture of trust, well-being, and long-term retention.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
