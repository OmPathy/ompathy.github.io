import { Card, CardContent } from "@/components/ui/card";
import { Users, Brain, TrendingUp } from "lucide-react";

export default function Vision() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Vision</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our goal is to create a future where global enterprises overcome their challenges through advanced technology, driving sustainable innovation and growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Workplace Culture Card */}
          <Card className="card-hover shadow-lg border border-gray-100">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Workplace Culture & Employee Satisfaction
              </h3>
              <p className="text-gray-600">
                Fostering an inclusive, thriving and satisfying workplace culture as the foundation of sustainable growth.
              </p>
            </CardContent>
          </Card>

          {/* AI Solutions Card */}
          <Card className="card-hover shadow-lg border border-gray-100">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Driven Solutions & Insights
              </h3>
              <p className="text-gray-600">
                Leveraging AI and advanced data analytics to deliver data-driven decision-making, real-time insights and actionable strategies.
              </p>
            </CardContent>
          </Card>

          {/* Growth Card */}
          <Card className="card-hover shadow-lg border border-gray-100">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Empowering Organizational Growth
              </h3>
              <p className="text-gray-600">
                Enabling professionals to better support employee engagement, while helping organizations accelerate organizational growth effectively.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
