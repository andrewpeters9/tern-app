import {Link} from "@nextui-org/link";
import {button as buttonStyles} from "@nextui-org/theme";

import {siteConfig} from "@/config/site";
import {subtitle, title} from "@/components/primitives";
import {GithubIcon, SearchIcon} from "@/components/icons";
import {Kbd} from "@nextui-org/kbd";
import {Input} from "@nextui-org/input";

export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-2xl text-center justify-center">
                <h1 className={title()}>All of Ethereum's data at your&nbsp;</h1>
                <h1 className={title({color: "violet"})}>fingertips&nbsp;</h1>
                <h2 className={subtitle({class: "mt-4"})}>
                    Merging world-class UI designs with a world-class blockchain
                </h2>
            </div>

            <div className="flex gap-3">
                <Link
                    isExternal
                    className={buttonStyles({variant: "bordered", radius: "full"})}
                    href={siteConfig.links.github}
                >
                    <GithubIcon size={20}/>
                    Check out the GitHub Repository
                </Link>
            </div>

            <div className="mt-8 w-full max-w-2xl">
                <Input
                    aria-label="Search by contract, token, tx hash or block "
                    size={"lg"}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    classNames={{
                        inputWrapper: "bg-default-100 !focus:outline-violet !focus:ring-violet",
                        input: "text-sm !focus:outline-violet !focus:ring-violet",
                    }}
                    endContent={
                        <Kbd className="hidden lg:inline-block" keys={["enter"]}>
                        </Kbd>
                    }
                    labelPlacement="outside"
                    placeholder="Search by contract, token, tx hash or block ..."
                    startContent={
                        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0"/>
                    }
                    type="search"
                />
            </div>
        </section>
    );
}
