"use client";

// Animations removed for this section

interface Service {
  id?: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
}

interface ServiceDetailsProps {
  content: {
    website: Service;
    aeo: Service;
    ads: Service;
    crm: Service;
  };
}

export default function ServiceDetails({ content }: ServiceDetailsProps) {
  const services: Service[] = [
    { ...content.website, id: "website" },
    { ...content.aeo, id: "aeo" },
    { ...content.ads, id: "ads" },
    { ...content.crm, id: "crm" },
  ];
  

  return (
    <section id="solution" className="relative bg-surface py-16 md:py-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-textPrimary mb-4 md:mb-6">
            토타로가 제공하는 솔루션
          </h2>
          <p className="text-lg md:text-xl text-textSecondary max-w-3xl mx-auto">
            각 단계별 최적화된 도구로 수출 성공률을 높입니다
          </p>
        </div>

        <div className="space-y-8 md:space-y-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-stretch ${
                index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
              }`}
            >
              {/* Title */}
              <div className={`text-center lg:text-left flex flex-col justify-center ${
                index % 2 === 1 ? "lg:col-start-2" : ""
              }`}>
                <h3 className="text-3xl md:text-4xl font-bold text-textPrimary mb-4">
                  {service.title}
                </h3>
                <p className="text-base md:text-lg text-textSecondary mb-8">
                  {service.description}
                </p>

                {/* Benefits */}
                <div className="space-y-3">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="text-accent"
                        >
                          <path
                            d="M5 13l4 4L19 7"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-textPrimary font-semibold text-sm md:text-base">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className={`${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                <div className="bg-bg rounded-2xl p-6 md:p-8 border border-line h-full flex flex-col">
                  <h4 className="text-lg md:text-xl font-bold text-textPrimary mb-4 md:mb-6">
                    주요 기능
                  </h4>
                  <ul className="space-y-3 md:space-y-4 flex-1">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-textSecondary text-sm md:text-base"
                      >
                        <span className="text-accent mt-1 flex-shrink-0">▪</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
