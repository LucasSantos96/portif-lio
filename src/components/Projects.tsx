import CardProjects from "./CardProjects";
import {
    SiNextdotjs,
    SiTailwindcss,
    SiTypescript,
    SiPrisma,
    SiNodedotjs,
    SiMysql,
    SiGit,
    SiReact,
    SiSqlite,
    SiN8n,
    SiJavascript,
    SiBootstrap,
    SiMongodb,
    SiHtml5,
    SiCss
} from '@icons-pack/react-simple-icons';

const Projects: React.FC = () => {
    const iconSize = 36;

    return (
        <section className="my-20 mx-4 text-white mb-14 flex flex-col items-center lg:mx-32 lg:py-28" id="projetos">

            <div>
                <h2 className="text-[20px] mb-5 lg:text-[40px] lg:text-center">Projetos</h2>
            </div>

            <div className="w-full flex items-center justify-center  gap-10 flex-wrap   " >




                <CardProjects
                    link={
                        "https://github.com/LucasSantos96/api_barber"
                    }
                    image={"/system-barber.png"}
                    title="API Barber"
                    subtitle="Sistema completo de gestão de clientes para barbearia desenvolvido com Next.js, Node.js e Prisma. Inclui cadastro, edição e exclusão de clientes, associação de planos com duração de 30 dias, contagem regressiva automática de dias restantes, renovação de planos com um clique e status dinâmico (ativo/inativo). Integração frontend/backend completa, suporte a MySQL (produção) e SQLite (local), e configuração com PM2 para execução contínua."

                    tecImg={[
                        <SiNextdotjs key="barber1" size={iconSize} color="#000000" />,
                        <SiTailwindcss key="barber2" size={iconSize} color="#06B6D4" />,
                        <SiTypescript key="barber3" size={iconSize} color="#3178C6" />,
                        <SiPrisma key="barber4" size={iconSize} color="#2D3748" />,
                        <SiNodedotjs key="barber5" size={iconSize} color="#339933" />,
                        <SiMysql key="barber6" size={iconSize} color="#4479A1" />,
                        <SiGit key="barber7" size={iconSize} color="#F05032" />
                    ]}
                />

                <CardProjects
                    link={
                        "https://saas-study-21vg.vercel.app/"
                    }
                    image={"/eduai.png"}
                    title="Edu ai"
                    subtitle="Sistema inteligente de geração de planos de estudo automatizado com n8n e DeepSeek, desenvolvido com React, Node.js e SQLite. A plataforma utiliza webhooks para orquestrar fluxos complexos no n8n, realizando buscas automáticas e criando cronogramas personalizados via inteligência artificial (DeepSeek) para qualquer tema. Inclui dashboard de gestão, autenticação segura (JWT), visualização modular de conteúdos e integração backend/frontend completa, focada em produtividade e automação de fluxos acadêmicos."

                    tecImg={[
                        <SiReact key="stud1" size={iconSize} color="#61DAFB" />,
                        <SiNodedotjs key="stud2" size={iconSize} color="#339933" />,
                        <SiSqlite key="stud3" size={iconSize} color="#003B57" />,
                        <SiGit key="stud4" size={iconSize} color="#F05032" />,
                        <SiN8n key="stud5" size={iconSize} color="#EA4B71" />
                    ]}
                />

                <CardProjects
                    link={
                        "https://lp-stefani.vercel.app/"
                    }
                    image={"/stefani.png"}
                    title="Stefani Fotografia"
                    subtitle="Landing page desenvolvida para uma fotógrafa profissional, com foco em apresentar seu trabalho de forma elegante e responsiva. Projeto construído com Next.js, TypeScript e Tailwind CSS, seguindo boas práticas de desenvolvimento e design moderno."

                    tecImg={[
                        <SiNextdotjs key="stefani1" size={iconSize} color="#000000" />,
                        <SiTailwindcss key="stefani2" size={iconSize} color="#06B6D4" />,
                        <SiTypescript key="stefani3" size={iconSize} color="#3178C6" />,
                        <SiGit key="stefani4" size={iconSize} color="#F05032" />
                    ]}
                />


                <CardProjects
                    link={
                        "https://blognode-mntu.onrender.com/"
                    }
                    image={"/blognode.png"}
                    title="BlogNode"
                    subtitle="Projeto BlogNode – Aplicação fullstack desenvolvida com Node.js, Express, MongoDB e Bootstrap. Inclui sistema completo de autenticação, CRUD de postagens com categorias, listagem de posts recentes e layout responsivo. Foco em boas práticas de desenvolvimento, estrutura modular e integração front-end/back-end."

                    tecImg={[
                        <SiNodedotjs key="blog1" size={iconSize} color="#339933" />,
                        <SiMongodb key="blog2" size={iconSize} color="#47A248" />,
                        <SiJavascript key="blog3" size={iconSize} color="#F7DF1E" />,
                        <SiGit key="blog4" size={iconSize} color="#F05032" />,
                        <SiBootstrap key="blog5" size={iconSize} color="#7952B3" />
                    ]}
                />

                <CardProjects
                    link={
                        "https://lpyoga.vercel.app/"
                    }
                    image={"/shanty.png"}
                    title="Shanty"
                    subtitle="Projeto desenvolvido com Next.js, baseado em um protótipo criado no Figma, com o objetivo de praticar e aplicar boas práticas de design e desenvolvimento front-end. O site simula a página de um estúdio de Yoga e Meditação, explorando conceitos de layout responsivo, tipografia, hierarquia visual e componentização no React. Além do aspecto estético, o projeto serviu como exercício para aprimorar organização de código, estrutura de pastas e padronização de estilos, visando uma experiência fluida e consistente em diferentes dispositivos."




                    tecImg={[
                        <SiNextdotjs key="shanty1" size={iconSize} color="#000000" />,
                        <SiTailwindcss key="shanty2" size={iconSize} color="#06B6D4" />,
                        <SiJavascript key="shanty3" size={iconSize} color="#F7DF1E" />,
                        <SiGit key="shanty4" size={iconSize} color="#F05032" />
                    ]}
                />

                <CardProjects
                    link={
                        "https://sunglassesproject-git-main-lucassantos96s-projects.vercel.app"
                    }
                    image={"/projetoOculos.png"}
                    title="Um sol pra cada um"
                    subtitle="Projeto criado com NextJs usando um protótipo criado no figma afim de testar conhecimentos e boas praticas de design."

                    tecImg={[
                        <SiNextdotjs key="oculos1" size={iconSize} color="#000000" />,
                        <SiTailwindcss key="oculos2" size={iconSize} color="#06B6D4" />,
                        <SiJavascript key="oculos3" size={iconSize} color="#F7DF1E" />,
                        <SiGit key="oculos4" size={iconSize} color="#F05032" />
                    ]}
                />


                <CardProjects
                    link={
                        "https://ticket-generator-kwl1-git-main-lucassantos96s-projects.vercel.appn"
                    }
                    image={"/projectTicket.png"}
                    title="Ticket Generator"
                    subtitle="Projeto criado com NextJs direto do site FrontEndMentor onde aceitei o desafio"

                    tecImg={[
                        <SiNextdotjs key="ticket1" size={iconSize} color="#000000" />,
                        <SiTailwindcss key="ticket2" size={iconSize} color="#06B6D4" />,
                        <SiGit key="ticket3" size={iconSize} color="#F05032" />,
                        <SiTypescript key="ticket4" size={iconSize} color="#3178C6" />
                    ]}
                />


                <CardProjects
                    link={
                        "https://lucassantos96.github.io/boa-forma/"
                    }
                    image={"/boaForma.png"}
                    title="Boa forma"
                    subtitle="Projeto criado com Html, Css e JavaScript, um site que além de um imc contém dicas de saúde etc.. "

                    tecImg={[
                        <SiHtml5 key="boa1" size={iconSize} color="#E34F26" />,
                        <SiCss key="boa2" size={iconSize} color="#1572B6" />,
                        <SiJavascript key="boa3" size={iconSize} color="#F7DF1E" />,
                        <SiGit key="boa4" size={iconSize} color="#F05032" />
                    ]}
                />

                <CardProjects
                    link={
                        "https://lucassantos96.github.io/linksseubeca/"
                    }
                    image={"/seuBeca.png"}
                    title="Links Seu Beca"
                    subtitle="Trabalho feito para uma barbearia com a idéia de deixar todos os links úteis em um só lugar. "

                    tecImg={[
                        <SiHtml5 key="beca1" size={iconSize} color="#E34F26" />,
                        <SiCss key="beca2" size={iconSize} color="#1572B6" />,
                        <SiJavascript key="beca3" size={iconSize} color="#F7DF1E" />,
                        <SiGit key="beca4" size={iconSize} color="#F05032" />
                    ]}
                />
            </div>

        </section>
    );
};

export default Projects;
