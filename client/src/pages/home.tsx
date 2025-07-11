import { Card, CardContent } from "@/components/ui/card";
import { Network, Users } from "lucide-react";
import heroImage from "@assets/image_1751676001229.png";

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
              <img
                src={heroImage}
                alt="OmPathy AI-driven business solutions with data analytics and network visualization"
                className="rounded-2xl shadow-xl w-full max-w-lg h-auto"
              />
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
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
                  alt="Modern office workspace with laptops and technology"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <Card className="absolute bottom-4 left-4 right-4 bg-primary text-white border-none">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      How We Met
                    </h3>
                  </CardContent>
                </Card>
              </div>
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
