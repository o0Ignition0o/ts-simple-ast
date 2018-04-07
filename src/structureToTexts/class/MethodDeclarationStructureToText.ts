﻿import CodeBlockWriter from "code-block-writer";
import {MethodDeclarationStructure} from "../../structures";
import {StructureToText} from "../StructureToText";
import {ModifierableNodeStructureToText} from "../base";
import {ParameterDeclarationStructureToText} from "../function";
import {JSDocStructureToText} from "../doc";
import {TypeParameterDeclarationStructureToText} from "../types";

export class MethodDeclarationStructureToText extends StructureToText<MethodDeclarationStructure> {
    private readonly jsDocWriter = new JSDocStructureToText(this.writer);
    private readonly modifierWriter = new ModifierableNodeStructureToText(this.writer);
    private readonly parametersWriter = new ParameterDeclarationStructureToText(this.writer);
    private readonly typeParametersWriter = new TypeParameterDeclarationStructureToText(this.writer);

    constructor(writer: CodeBlockWriter, private readonly opts: { isAmbient: boolean; }) {
        super(writer);
    }

    writeTexts(structures: MethodDeclarationStructure[]) {
        for (let i = 0; i < structures.length; i++) {
            if (i > 0) {
                if (this.opts.isAmbient)
                    this.writer.newLine();
                else
                    this.writer.blankLine();
            }
            this.writeText(structures[i]);
        }
    }

    writeText(structure: MethodDeclarationStructure) {
        this.jsDocWriter.writeDocs(structure.docs);
        this.modifierWriter.writeText(structure);
        this.writer.write(structure.name);
        this.typeParametersWriter.writeTexts(structure.typeParameters);
        this.writer.write("(");
        this.parametersWriter.writeTexts(structure.parameters);
        this.writer.write(`)`);
        this.writer.conditionalWrite(structure.returnType != null && structure.returnType.length > 0, `: ${structure.returnType}`);

        if (this.opts.isAmbient)
            this.writer.write(";");
        else
            this.writer.spaceIfLastNot().inlineBlock();
    }
}
