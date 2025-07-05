import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  Cloud,
  BarChart3,
  Lightbulb,
  Shield,
  MessageSquare,
  Plug,
  Microscope
} from "lucide-react";

export default function Product() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">OmPathy</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Always on Path, always with you.
          </p>
          <p className="text-gray-600 max-w-4xl mx-auto">
            OmPathy is an innovative platform that harnesses the power of sentiment analysis to revolutionize HR business by managing cutting-edge technologies. We integrate state-of-the-art technologies—such as natural language processing, computer vision, and generative AI—to develop intelligent tools that streamline analytics internal decision making and operational excellence efficiently.
          </p>
        </div>

        {/* Hero Illustration */}
        <div className="flex justify-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
            alt="Business team collaborating with technology and data analytics"
            className="rounded-2xl shadow-xl w-full max-w-4xl h-64 object-cover"
          />
        </div>

        {/* Product Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* AI Chatbot */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Bot className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Chatbot</h3>
              <p className="text-sm text-gray-600">
                Enhanced communication through conversational AI to understand and respond to workplace concerns and queries.
              </p>
            </CardContent>
          </Card>

          {/* Cloud Computing */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cloud Computing</h3>
              <p className="text-sm text-gray-600">
                Scalable infrastructure that guarantees secure data processing with enhanced accessibility and reliability.
              </p>
            </CardContent>
          </Card>

          {/* Real-time Data Analysis */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Real-time Data Analysis</h3>
              <p className="text-sm text-gray-600">
                Instant insights and analytics to enhance decision-making using AI-powered analysis tools.
              </p>
            </CardContent>
          </Card>

          {/* Automated Insights */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Automated Insights</h3>
              <p className="text-sm text-gray-600">
                Our comprehensive AI systems allow HR teams to make recommendations, detecting sentiments and enhancing internal intelligence.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Security & Privacy */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Security & Privacy</h3>
              <p className="text-sm text-gray-600">
                Robust security protocols protecting users' privacy through end-to-end encryption and secure environments.
              </p>
            </CardContent>
          </Card>

          {/* Customized Feedback */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customized Feedback</h3>
              <p className="text-sm text-gray-600">
                Tailored to specific needs systems through providing advanced machine learning-driven insights.
              </p>
            </CardContent>
          </Card>

          {/* Integration with Platforms */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Plug className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration with Platforms</h3>
              <p className="text-sm text-gray-600">
                Seamless connections with existing enterprise tools and platforms enabling easier data management and effective application.
              </p>
            </CardContent>
          </Card>

          {/* Advanced Analytics */}
          <Card className="card-hover shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                <Microscope className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-sm text-gray-600">
                Deep analytical capabilities offering AI and data insight, allowing HR teams to uncover insights and make informed decisions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 leading-relaxed">
              AMC International is pioneering rapid and innovative decision-making by providing management tools that identify internal issues and implement effective solutions. Our mission is to enhance business competitiveness through intelligent insights to reduce costs and growth by improving internal operational efficiencies.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mt-4">
              Through AI, we help organizations effectively analyze, operate, and improve their workplace's sustainable growth and strengthening their competitive edge.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
