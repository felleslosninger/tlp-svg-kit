import { Dialog, Heading } from '@digdir/designsystemet-react';
import { type ReactNode, useId, useRef, useState } from 'react';

export type IllustrationProps = {
	children?: ReactNode;
	title: string;
};

export default function Illustration({ children, title }: IllustrationProps) {
	const id = useId();
	const [rawSvg, setRawSvg] = useState<string | null>(null);
	const modalRef = useRef<HTMLDialogElement>(null);

	const handleOpenModal = () => {
		const svgElm = document.getElementById(id);
		if (svgElm) {
			const svgCode = svgElm.innerHTML;
			setRawSvg(svgCode);
		}

		if (modalRef.current) {
			modalRef.current.showModal();
		}
	};

	return (
		<>
			<button
				className="svg-grid__item ds-focus"
				aria-label={'Åpne modal for ' + title}
				onClick={handleOpenModal}
			>
				{children}
				<span>{title}</span>
			</button>
			<Dialog
				title={title}
				closedby="any"
				ref={modalRef}
				className="svg-grid__modal"
				data-color-scheme="dark"
			>
				<Dialog.Block>
					<Heading>{title}</Heading>
				</Dialog.Block>
				<Dialog.Block>
					<div className="svg-grid__modal--info">
						<div className="svg-grid__modal--info--boxes">
							<div>
								<Heading level={3}>React</Heading>
								<pre>
									{`import { ${title} } from '@digdir/illustration-lib';`}
									{'\n'}
									{`<${title} />`}
									{'\n'}
								</pre>
							</div>
							<div>
								<Heading level={3}>Svg</Heading>
								<pre>{rawSvg}</pre>
							</div>
						</div>
						<div className="svg-grid__modal--info--illustration" id={id}>
							{children}
						</div>
					</div>
				</Dialog.Block>
			</Dialog>
		</>
	);
}
